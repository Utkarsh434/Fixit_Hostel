// app/api/tickets/[ticketId]/status/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { Status } from "@prisma/client";

export async function PUT(
  request: Request,
  ctx: { params: Promise<{ ticketId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WARDEN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { ticketId } = await ctx.params;

  const { status } = await request.json();
  if (!status || !Object.values(Status).includes(status)) {
    return new NextResponse("Invalid status provided", { status: 400 });
  }
  if (!ticketId) {
    return new NextResponse("Missing ticket ID", { status: 400 });
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: { status },
  });

  return NextResponse.json(updatedTicket);
}
