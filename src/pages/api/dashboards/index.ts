import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth/[...nextauth]';
import axios from 'utils/axios';
import { AuthInfo } from 'types/auth';
import { DashboardState, DashboardSummary, WorksetInfo } from 'types/torchlite';
import { getSessionAuthInfo } from 'utils/database';
import { getCookie, setCookie } from 'cookies-next';
import { pickRandom } from 'utils/helpers';

const torchliteUid: string = '95164779-1fc9-4592-9c74-7a014407f46d';

async function cloneDashboard(dashboardId: string, headers: any, headersGet: any = headers): Promise<DashboardSummary> {
//  console.log(dashboardId)
  const { worksetId, filters, widgets, importedId } = await axios.get<DashboardSummary>(`/dashboards/${dashboardId}`, {
    headers: headersGet
  });
//  console.log(worksetId)
//  console.log(importedId)
//  console.log(typeof importedId)

  return await axios.post<DashboardSummary>(
    `/dashboards/`,
    {
      worksetId: worksetId,
      filters: filters,
      widgets: widgets,
      importedId: importedId
    },
    {
      headers: headers
    }
  );
}

async function getFeaturedDashboardClone(headers: any): Promise<[DashboardSummary, string]> {
  let featuredDashboardId = getCookie('featured_dashboard_id');
  let dashboardSummary: DashboardSummary;

  if (featuredDashboardId) {
    // we have a featured dashboard cookie set -- retrieve it and create
    // a new dashboard based on it (i.e. clone it)
    dashboardSummary = await cloneDashboard(featuredDashboardId, headers);
  } else {
    // no featured dashboard cookie set - retrieve the list of featured dashboards
//    console.log("GETTING TORCHLITE USER DASHBOARDS")
    const featuredDashboards = await axios.get<DashboardSummary[]>(`/dashboards/`, {
      headers: headers,
      params: { owner: torchliteUid }
    });
//    console.log("Featured Dashboards")
//    console.log(featuredDashboards)
    if (featuredDashboards) {
      // ...and pick a random one
      dashboardSummary = pickRandom(featuredDashboards);
//      console.log("Dashboard Summary 1")
//      console.log(dashboardSummary)
      featuredDashboardId = dashboardSummary.id;
      dashboardSummary = await cloneDashboard(featuredDashboardId, headers);
//      console.log("Dashboard Summary 2")
//      console.log(dashboardSummary)
    } else throw Error('No featured dashboards available!');
  }

  return [dashboardSummary, featuredDashboardId];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    let headers: any;
    let dashboardSummary: DashboardSummary | undefined;
    let featuredDashboardId: string | undefined;

    const session = await getServerSession(req, res, authOptions);
    if (session) {
      // authenticated user
      const authInfo: AuthInfo = await getSessionAuthInfo(session.sessionId);
      headers = {
        Authorization: `Bearer ${authInfo.accessToken}`
      };

      // get the user's dashboards
      const dashboards = await axios.get<DashboardSummary[]>(`/dashboards/`, {
        headers: headers
      });

      if (dashboards.length) dashboardSummary = dashboards[0]; // we can only handle one dashboard right now
      else if (req.query.ref) {
        const oldDashboardId = req.query.ref as string;
        // headersGet = {} to be able to access the old "anonymous" dashboard
        dashboardSummary = await cloneDashboard(oldDashboardId, headers, {});
      }
    }

    if (!dashboardSummary)
      // the user doesn't have any dashboards (probably first time logging in)
      [dashboardSummary, featuredDashboardId] = await getFeaturedDashboardClone(headers);
//    console.log("GETTING WORKSET METADATA FOR")
//    console.log(dashboardSummary)

    const worksetInfo = await axios.get<WorksetInfo>(`/worksets/${dashboardSummary.importedId}/metadata`, {
      headers: headers
    });

    if (featuredDashboardId)
      setCookie('featured_dashboard_id', featuredDashboardId, {
        req,
        res,
        maxAge: 60 * 60 * 24 * 1 // 1 day
      });

    const dashboardState: DashboardState = { ...dashboardSummary, worksetInfo: worksetInfo };
    res.status(200).json([dashboardState]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
