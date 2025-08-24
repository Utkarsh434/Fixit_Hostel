// app/api/tickets/[ticketId]/status/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { Status } from '@prisma/client';

// This is the correct function signature for a dynamic route in the Next.js App Router
export async function PUT(
  request: Request,
  { params }: { params: { ticketId: string } }
) {
  const session = await getServerSession(authOptions);

  // Protect the route and ensure the user is a WARDEN
  if (!session?.user?.id || session.user.role !== 'WARDEN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { ticketId } = params;
  const body = await request.json();
  const { status } = body;

  // Validate the new status to ensure it's one of the allowed values
  if (!status || !Object.values(Status).includes(status)) {
    return new NextResponse('Invalid status provided', { status: 400 });
  }
  
  if (!ticketId) {
    return new NextResponse('Missing ticket ID', { status: 400 });
  }

  const updatedTicket = await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: status,
    },
  });

  return NextResponse.json(updatedTicket);
}
