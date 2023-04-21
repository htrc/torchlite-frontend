import { NextApiRequest, NextApiResponse } from 'next';
import { worksets } from 'data/workset';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query } = req.query;
    let response;
    switch (query) {
      case 'all':
        response = worksets;
        break;
      case 'recommend':
        response = worksets.slice(0, worksets.length / 2);
        break;
      default:
        response = [...worksets].filter((item) => item.creator === query);
        break;
    }
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
