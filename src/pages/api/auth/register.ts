// next
import { NextApiRequest, NextApiResponse } from 'next';

import { users } from 'data/account';

// ==============================|| ACCOUNT - LOGIN  ||============================== //

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Enter Your Email & Password' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Enter Your Name' });
    }

    const user = users.find((_user) => _user.email === email);

    if (user) {
      return res.status(400).json({ message: 'Email address already exists' });
    }
    const data = { id, name, email, password };
    users.push(data);

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
