import { NextApiRequest, NextApiResponse } from 'next';
import { worksets } from 'data/workset';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query } = req.query;
    let response;
    if (query !== 'all') {
      response = [...worksets].filter((item) => item.type === query);
    } else {
      response = worksets;
    }
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
