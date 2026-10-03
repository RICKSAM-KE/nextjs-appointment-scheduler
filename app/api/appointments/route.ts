import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { appointmentDate: "asc" },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.appointmentDate) {
      return NextResponse.json(
        { error: "Title and appointment date are required" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        title: body.title,
        description: body.description || null,
        appointmentDate: new Date(body.appointmentDate),
        reminderMinutes: body.reminderMinutes || 60,
        status: "upcoming",
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}