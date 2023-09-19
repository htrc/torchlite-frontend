import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./db/database.sqlite3', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    db.run(
      `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            sessionId TEXT,
            data TEXT
        )
      `,
      (err) => {
        if (err) {
          console.error('Could not create users table', err);
        } else {
          console.log('Users table ready');
        }
      }
    );
  }
});

db.close();
