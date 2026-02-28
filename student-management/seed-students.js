const db = require("better-sqlite3")("./app.db");

// Insert sample students
const stmt = db.prepare(`
  INSERT INTO students (firstName, lastName, email, phone, studentId, status)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const students = [
  ["Ali", "Mohammed", "ali.mohammed@esisa.ac.ma", "+212612345678", "STU001", "active"],
  ["Fatima", "Ahmed", "fatima.ahmed@esisa.ac.ma", "+212623456789", "STU002", "active"],
  ["Hassan", "Smith", "hassan.smith@esisa.ac.ma", "+212634567890", "STU003", "active"],
  ["Zahra", "Ibn", "zahra.ibn@esisa.ac.ma", "+212645678901", "STU004", "active"],
  ["Mohamed", "Karim", "mohamed.karim@esisa.ac.ma", "+212656789012", "STU005", "graduated"],
];

try {
  students.forEach(student => {
    stmt.run(...student);
  });
  console.log("Students added successfully!");
  const count = db.prepare("SELECT COUNT(*) as count FROM students").get();
  console.log("Total students:", count.count);
} catch(err) {
  console.error("Error:", err.message);
}
