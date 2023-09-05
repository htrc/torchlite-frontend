import { NextApiRequest, NextApiResponse } from 'next';
import { getCookieValue } from 'utils/helpers';
import axios from 'utils/axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const sessionId = getCookieValue('session_id', req.headers.cookie || '');

  if (!sessionId) {
    return res.status(400).json({ status: 'error', message: 'session_id cookie not found.' });
  }
  try {
    let response = await axios.get(`/worksets`);
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
