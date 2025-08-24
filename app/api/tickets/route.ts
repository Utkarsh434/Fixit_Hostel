// app/api/tickets/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

// GET function to fetch all tickets for the warden
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  // Protect the route and ensure user is a WARDEN
  if (!session?.user?.id || session.user.role !== 'WARDEN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const tickets = await prisma.ticket.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      student: { // We still want to include the student's name
        select: {
          name: true,
          email: true,
        },
      },
      // --- MODIFICATION: The 'technician' relation is removed ---
      // The assignedTechnicianName is now a direct field on the ticket
      // and will be fetched automatically.
    },
  });

  return NextResponse.json(tickets);
}
