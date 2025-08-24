import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth'; // <-- CORRECTED IMPORT
import prisma from '@/app/lib/prisma';

// --- MODIFICATION: Corrected function signature for Next.js App Router ---
export async function PUT(
  request: Request,
  { params }: { params: { ticketId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== 'WARDEN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { ticketId } = params;
  const body = await request.json();
  const { technicianName } = body;

  if (!ticketId || !technicianName) {
    return new NextResponse('Missing ticket ID or technician name', { status: 400 });
  }

  const updatedTicket = await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      assignedTechnicianName: technicianName,
      status: 'ASSIGNED',
    },
  });

  return NextResponse.json(updatedTicket);
}