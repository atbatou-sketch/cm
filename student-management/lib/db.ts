import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "app.db");
export const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    dateOfBirth DATETIME,
    address TEXT,
    city TEXT,
    postalCode TEXT,
    country TEXT,
   enrollmentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    studentId TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
