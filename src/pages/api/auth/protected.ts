// This is an example of to protect an API route
import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (session) {
    res.send({ protected: true });
  } else {
    res.send({ protected: false });
  }
}
