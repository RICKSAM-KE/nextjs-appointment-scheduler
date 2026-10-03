import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const appointment = await prisma.appointment.update({
    where: { id: Number(params.id) },
    data: {
      ...(body.title ? { title: String(body.title).trim() } : {}),
      ...(body.description !== undefined
        ? { description: body.description ? String(body.description).trim() : null }
        : {}),
      ...(body.appointmentDate ? { appointmentDate: new Date(body.appointmentDate) } : {}),
      ...(body.reminderMinutes !== undefined ? { reminderMinutes: Number(body.reminderMinutes) } : {}),
      ...(body.status ? { status: String(body.status) } : {}),
    },
  });

  return NextResponse.json(appointment);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.appointment.delete({
    where: { id: Number(params.id) },
  });

  return NextResponse.json({ success: true });
}
