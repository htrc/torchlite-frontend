import { NextApiRequest, NextApiResponse } from 'next';
import mapData from 'data/mapData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json(mapData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
