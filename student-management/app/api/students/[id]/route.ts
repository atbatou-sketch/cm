import { NextRequest, NextResponse } from "next/server";
import db  from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const student = db.prepare("SELECT * FROM students WHERE id = ?").get(id);

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
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
      status,
    } = body;

    const updates: string[] = [];
    const values: any[] = [];

    if (firstName !== undefined) {
      updates.push("firstName = ?");
      values.push(firstName);
    }
    if (lastName !== undefined) {
      updates.push("lastName = ?");
      values.push(lastName);
    }
    if (email !== undefined) {
      updates.push("email = ?");
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push("phone = ?");
      values.push(phone);
    }
    if (dateOfBirth !== undefined) {
      updates.push("dateOfBirth = ?");
      values.push(dateOfBirth);
    }
    if (address !== undefined) {
      updates.push("address = ?");
      values.push(address);
    }
    if (city !== undefined) {
      updates.push("city = ?");
      values.push(city);
    }
    if (postalCode !== undefined) {
      updates.push("postalCode = ?");
      values.push(postalCode);
    }
    if (country !== undefined) {
      updates.push("country = ?");
      values.push(country);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      updates.push("updatedAt = CURRENT_TIMESTAMP");
    } else {
      updates.push("updatedAt = CURRENT_TIMESTAMP");
    }
    values.push(id);

    const query = `UPDATE students SET ${updates.join(", ")} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...values);

    const student = db.prepare("SELECT * FROM students WHERE id = ?").get(id);
    return NextResponse.json(student);
  } catch (error: any) {
    console.error("Error updating student:", error);
    if (error.message.includes("no such table") || error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }
    if (error.message.includes("UNIQUE")) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const stmt = db.prepare("DELETE FROM students WHERE id = ?");
    const result = stmt.run(id);

    if (!result.changes) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
