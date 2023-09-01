import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the client sent a unique ID cookie
  const sessionId = req.cookies.session_id;

  if (!sessionId) {
    // Generate a new unique ID using UUID
    const newSessionId = uuidv4();

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieAttributes = `session_id=${newSessionId}; HttpOnly; Path=/; Max-Age=31536000;${isProduction ? ' Secure;' : ''}`;

    // Set the cookie
    res.setHeader('Set-Cookie', cookieAttributes);
    res.status(200).json({ status: 'session_id set', session_id: newSessionId });
  } else {
    // The user already has a unique ID cookie
    res.status(200).json({ status: 'session_id exists', sessionId });
  }
}
