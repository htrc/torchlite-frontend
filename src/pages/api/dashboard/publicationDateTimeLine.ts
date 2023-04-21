import { NextApiRequest, NextApiResponse } from 'next';
import publicationDateTimeLineChart from 'data/publicationDateTimeLine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  try {
    if (query) {
      switch (query) {
        case 'all':
          res.status(200).json(publicationDateTimeLineChart);
          break;
        case 'recommend':
          res.status(200).json([publicationDateTimeLineChart[Math.floor(Math.random() * 10)]]);
          break;
        default:
          res.status(200).json([...publicationDateTimeLineChart].filter((item) => item.creator === query));
          break;
      }
    } else {
      res.status(200).json(publicationDateTimeLineChart);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
