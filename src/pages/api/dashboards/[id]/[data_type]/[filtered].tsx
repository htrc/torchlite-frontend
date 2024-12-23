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
    let headers: any = {};

    const session = await getServerSession(req, res, authOptions);
    if (session) {
      const authInfo: AuthInfo = await getSessionAuthInfo(session.sessionId);
      headers = {
        Authorization: `Bearer ${authInfo.accessToken}`
      };
    }

    const dashboardId = req.query.id as string;
    const dataType = req.query.data_type as string;
    const filtered = req.query.filtered; 

    console.log(filtered)
    console.log(dashboardId) 
    console.log(dataType)
    const response = await axios.get(`/dashboards/${dashboardId}/${dataType}${filtered ? '?filtered=true' : ''}`, {
      headers: headers
    });
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Error fetching data from backend:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
