import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { appointmentDate: "asc" },
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const body = await request.json();

  const appointment = await prisma.appointment.create({
    data: {
      title: String(body.title ?? "").trim(),
      description: body.description ? String(body.description).trim() : null,
      appointmentDate: new Date(body.appointmentDate),
      reminderMinutes: Number(body.reminderMinutes ?? 60),
      status: "upcoming",
    },
  });

  return NextResponse.json(appointment, { status: 201 });
}
