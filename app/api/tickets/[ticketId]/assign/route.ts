// app/api/tickets/[ticketId]/assign/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function PUT(
  request: Request,
  ctx: { params: Promise<{ ticketId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WARDEN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { ticketId } = await ctx.params;

  const { technicianName } = await request.json();
  if (!ticketId || !technicianName) {
    return new NextResponse("Missing ticket ID or technician name", { status: 400 });
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: { assignedTechnicianName: technicianName, status: "ASSIGNED" },
  });

  return NextResponse.json(updatedTicket);
}
