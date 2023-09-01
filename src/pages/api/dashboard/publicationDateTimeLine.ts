import { NextApiRequest, NextApiResponse } from 'next';
import publicationDateTimeLineMetaData from 'data/publicationDateTimeLineMetaData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
      // return axios.get(`/dashboards/${dashboard.id}/widget/${'default_widget'}/data`);
    res.status(200).json(publicationDateTimeLineMetaData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
