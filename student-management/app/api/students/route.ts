import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const students = db.prepare("SELECT * FROM students ORDER BY createdAt DESC").all();
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      city,
      postalCode,
      country,
      studentId,
    } = body;

    if (!firstName || !lastName || !email || !studentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO students (firstName, lastName, email, phone, dateOfBirth, address, city, postalCode, country, studentId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(firstName, lastName, email, phone, dateOfBirth || null, address, city, postalCode, country, studentId);

    const student = db.prepare("SELECT * FROM students WHERE email = ?").get(email);
    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student:", error);
    if (error.message.includes("UNIQUE")) {
      return NextResponse.json(
        { error: "Email or Student ID already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}
