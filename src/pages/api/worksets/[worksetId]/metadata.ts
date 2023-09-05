import { NextApiRequest, NextApiResponse } from 'next';
import { getCookieValue } from 'utils/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { worksetId } = req.query;
  const sessionId = getCookieValue('session_id', req.headers.cookie || '');

  if (!sessionId) {
    return res.status(400).json({ status: 'error', message: 'session_id cookie not found.' });
  }

  try {
    const externalResponse = await fetch(`https://tools.htrc.illinois.edu/ef-api/worksets/${worksetId}/metadata`);

    if (!externalResponse.ok) {
      return res.status(500).json({ status: 'error', message: 'Error fetching external API.' });
    }

    const externalData = await externalResponse.json();

    if (externalData.code === 200) {
      return res.status(200).json({ status: 'success', data: externalData.data });
    } else {
      return res.status(500).json({ status: 'error', message: 'Error in external data response.' });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Unexpected error occurred.' });
  }
}
