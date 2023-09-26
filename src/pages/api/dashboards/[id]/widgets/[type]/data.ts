import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth/[...nextauth]';
import axios from 'utils/axios';
import { AuthInfo } from 'types/auth';
import { getSessionAuthInfo } from 'utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
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
    const widgetType = req.query.type as string;
    const widgetData = await axios.get(`/dashboards/${dashboardId}/widgets/${widgetType}/data`, {
      headers: headers
    });
    res.status(200).json(widgetData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
