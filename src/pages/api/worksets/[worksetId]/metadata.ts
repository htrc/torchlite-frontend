import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { worksetId } = req.query;

  try {
    const externalResponse = await fetch(`https://tools.htrc.illinois.edu/ef-api/worksets/${worksetId}/metadata`);

    if (!externalResponse.ok) {
      return res.status(500).json({ status: 'error', message: 'Error fetching external API.' });
    }

    const externalData = await externalResponse.json();

    if (externalData.code === 200) {
      return res.status(200).json(externalData.data);
    } else {
      return res.status(500).json({ message: `Error ${externalData.code} in external data response.` });
    }
  } catch (error) {
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
}
