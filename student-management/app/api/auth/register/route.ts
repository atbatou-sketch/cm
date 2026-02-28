import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const stmt = db.prepare(`
      INSERT INTO users (email, password, name, role)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(email, hashedPassword, name, "admin");

    return NextResponse.json(
      { message: "User created successfully", userId: result.lastInsertRowid },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
