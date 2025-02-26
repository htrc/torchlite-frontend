import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth/[...nextauth]';
import axios from 'utils/axios';
import { AuthInfo } from 'types/auth';
import { DashboardState, DashboardStatePatch, DashboardStatePatchSchema, DashboardSummary, WorksetInfo } from 'types/torchlite';
import { getSessionAuthInfo } from 'utils/database';
import { isValidBody } from 'utils/helpers';

async function getDashboard(dashboardId: string, headers: any): Promise<DashboardState> {
  const dashboardSummary = await axios.get<DashboardSummary>(`/dashboards/${dashboardId}`, {
    headers: headers
  });
  const worksetInfo = await axios.get<WorksetInfo>(`/worksets/${dashboardSummary.importedId}/metadata`, {
    headers: headers
  });

  return { ...dashboardSummary, worksetInfo: worksetInfo };
}

async function patchDashboard(dashboardId: string, patch: DashboardStatePatch, headers: any) {
  await axios.patch(`/dashboards/${dashboardId}`, patch, { headers: headers });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    switch (req.method) {
      case 'GET':
        const dashboardState = await getDashboard(dashboardId, headers);
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
    console.log(err);
    if (err.status == 400) {
      res.status(400).end();
    }
    else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
