import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth/[...nextauth]';
import axios from 'utils/axios';
import { AuthInfo } from 'types/auth';
import { DashboardState, DashboardStatePatch, DashboardStatePatchSchema, DashboardSummary, WorksetInfo } from 'types/torchlite';
import { getSessionAuthInfo } from 'utils/database';
import { isValidBody } from 'utils/helpers';

async function getDashboard(dashboardId: string | null, headers: any): Promise<DashboardState> {
  console.log('getDashboard!')
  const request_url = `/dashboards/${dashboardId ? dashboardId : 'private'}`;
  console.log(request_url)
  const dashboardSummary = await axios.get<DashboardSummary>(request_url, {
    headers: headers
  });
  console.log('getMetadata!')
  const worksetInfo = await axios.get<WorksetInfo>(`/worksets/${dashboardSummary.importedId}/metadata`, {
    headers: headers
  });

  return { ...dashboardSummary, worksetInfo: worksetInfo };
}

async function patchDashboard(dashboardId: string, patch: DashboardStatePatch, headers: any) {
  console.log('patchDashboard')
  console.log(dashboardId)
  console.log(headers)
  const results = await axios.patch(`/dashboards/${dashboardId}`, patch, { headers: headers });
  console.log("results")
  console.log(results)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('get or patch dashboard')
  console.log(req.method)
  if (req.method !== 'GET' && req.method !== 'PATCH') {
    res.setHeader('Allow', ['GET', 'PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    let headers: any;

    const session = await getServerSession(req, res, authOptions);
    if (session) {
      const authInfo: AuthInfo = await getSessionAuthInfo(session.sessionId);
      headers = {
        Authorization: `Bearer ${authInfo.accessToken}`
      };
    }

    const dashboardId = req.query.id as string;
    console.log("Session")
    console.log(session)

    switch (req.method) {
      case 'GET':
        const dashboardState = await getDashboard(session ? null : dashboardId, headers);
        res.status(200).json(dashboardState);
        break;

      case 'PATCH':
        if (isValidBody<DashboardStatePatch>(req.body, DashboardStatePatchSchema)) {
          await patchDashboard(dashboardId, req.body, headers);
          res.status(204).end();
        }
        break;
    }
  } catch (err: any) {
    console.error(`${req.method} /dashboards/${req.query.id}`);
    console.error(err);
    if (err.status == 400) {
      res.status(400).end();
    }
    else if (err.status == 404) {
      res.status(404).end();
    }
    else if (err.status == 422) {
      res.status(422).end();
    }
    else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
