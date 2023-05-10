import { NextApiRequest, NextApiResponse } from 'next';
import { FilterKeys } from 'data/datafilters';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json(FilterKeys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
