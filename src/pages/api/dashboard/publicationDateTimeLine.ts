import { NextApiRequest, NextApiResponse } from 'next';
import publicationDateTimeLineChart from 'data/publicationDateTimeLine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json(publicationDateTimeLineChart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
