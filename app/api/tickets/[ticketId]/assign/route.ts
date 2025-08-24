import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';

interface IParams {
  ticketId?: string;
}

export async function PUT(
  request: Request,
  { params }: { params: IParams }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== 'WARDEN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { ticketId } = params;
  const body = await request.json();
  const { technicianName } = body; // We now expect a name, not an ID

  if (!ticketId || !technicianName) {
    return new NextResponse('Missing ticket ID or technician name', { status: 400 });
  }

  const updatedTicket = await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      assignedTechnicianName: technicianName, // Store the name
      status: 'ASSIGNED',
    },
  });

  return NextResponse.json(updatedTicket);
}
