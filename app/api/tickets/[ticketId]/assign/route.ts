// app/api/tickets/[ticketId]/assign/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

// --- FINAL FIX: Simplified function signature ---
export async function PUT(
  request: Request
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== 'WARDEN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // --- Get ticketId directly from the URL ---
  const url = new URL(request.url);
  const ticketId = url.pathname.split('/')[3]; // Extracts the ID from /api/tickets/[ticketId]/assign

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
