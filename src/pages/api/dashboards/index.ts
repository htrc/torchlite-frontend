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

async function cloneDashboard(dashboardId: string, headers: any): Promise<DashboardSummary> {
  const { worksetId, filters, widgets } = await axios.get<DashboardSummary>(`/dashboards/${dashboardId}`, {
    headers: headers
  });

  return await axios.post<DashboardSummary>(
    `/dashboards`,
    {
      worksetId: worksetId,
      filters: filters,
      widgets: widgets
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
    const featuredDashboards = await axios.get<DashboardSummary[]>(`/dashboards/`, {
      headers: headers,
      params: { owner: torchliteUid }
    });
    if (featuredDashboards) {
      // ...and pick a random one
      dashboardSummary = pickRandom(featuredDashboards);
      featuredDashboardId = dashboardSummary.id;
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

      if (dashboards) dashboardSummary = dashboards[0]; // we can only handle one dashboard right now
      else if (req.query.ref) dashboardSummary = await cloneDashboard(req.query.ref as string, headers);
    }

    if (!dashboardSummary)
      // the user doesn't have any dashboards (probably first time logging in)
      [dashboardSummary, featuredDashboardId] = await getFeaturedDashboardClone(headers);

    const worksetInfo = await axios.get<WorksetInfo>(`/worksets/${dashboardSummary.worksetId}/metadata`, {
      headers: headers
    });

    if (featuredDashboardId)
      setCookie('featured_dashboard_id', featuredDashboardId, {
        req,
        res,
        maxAge: 60 * 60 * 24 * 365 // 1 year
      });

    const dashboardState: DashboardState = { ...dashboardSummary, worksetInfo: worksetInfo };
    res.status(200).json([dashboardState]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
