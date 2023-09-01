import { NextApiRequest, NextApiResponse } from 'next';
import { getCookieValue } from 'utils/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { worksetId } = req.query;
  const sessionId = getCookieValue('session_id', req.headers.cookie || '');

  if (!sessionId) {
    res.status(400).json({ status: 'error', message: 'session_id cookie not found.' });
    return;
  }

  try {
    const externalResponse = await fetch(`https://tools.htrc.illinois.edu/ef-api/worksets/${worksetId}/metadata`);

    if (!externalResponse.ok) {
      res.status(500).json({ status: 'error', message: 'Error fetching external API.' });
      return;
    }

    const externalData = await externalResponse.json();

    if (externalData.code === 200) {
      res.status(200).json({ status: 'success', data: externalData.data });
    } else {
      res.status(500).json({ status: 'error', message: 'Error in external data response.' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Unexpected error occurred.' });
  }
}
