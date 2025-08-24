import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

// GET function to fetch all tickets for any logged-in user
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  // Protect the route - any logged-in user can view this
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const tickets = await prisma.ticket.findMany({
    orderBy: {
      createdAt: 'desc', // Show the newest tickets first
    },
    include: {
      student: { // Include the name of the student who created the ticket
        select: {
          name: true,
        },
      },
    },
  });

  return NextResponse.json(tickets);
}
