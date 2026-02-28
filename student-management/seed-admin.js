const db = require("better-sqlite3")("./app.db");
const bcrypt = require("bcryptjs");

// Create an admin user
const hashedPassword = bcrypt.hashSync("Admin123!", 10);
const stmt = db.prepare(`
  INSERT INTO users (email, password, name, role)
  VALUES (?, ?, ?, ?)
`);

try {
  const result = stmt.run("admin@esisa.ac.ma", hashedPassword, "Admin ESISA", "admin");
  console.log("User created successfully:", result.lastInsertRowid);
} catch(err) {
  console.error("Error:", err.message);
}

// Verify user was created
const users = db.prepare("SELECT email, name, role FROM users").all();
console.log("Current users:", users);
