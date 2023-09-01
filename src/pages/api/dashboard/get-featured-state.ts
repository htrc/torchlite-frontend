import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { getCookieValue } from 'utils/helpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await open({ filename: './database.sqlite3', driver: sqlite3.Database });
  const sessionId = getCookieValue('session_id', req.headers.cookie || '');

  if (!sessionId) {
    await db.close();
    return res.status(400).json({ status: 'error', message: 'session_id cookie not found.' });
  }
  try {
    const row = await db.get('SELECT sessionId, data FROM users WHERE sessionId = ?', sessionId);

    if (row) {
      res.status(200).json({ status: 'success', message: 'User already exists', row });
    } else {
      const stmt = await db.run('INSERT INTO users (sessionId) VALUES (?)', sessionId);
      if (stmt.changes) {
        res.status(201).json({ status: 'success', message: 'User added' });
      } else {
        res.status(500).json({ status: 'error', message: 'Failed to insert user' });
      }
    }
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: 'Database error', error: err.message });
  } finally {
    await db.close();
  }
}
