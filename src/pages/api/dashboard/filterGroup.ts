import { NextApiRequest, NextApiResponse } from 'next';
import { FilterGroup } from 'data/datafilters';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json(FilterGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
