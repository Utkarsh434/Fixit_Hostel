import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { Category, Priority } from '@prisma/client';

// This is the most robust way to define the PUT function for Vercel builds
export async function PUT(request: Request) {
  // 1. Get the session and check for Warden role
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'WARDEN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // 2. Extract the ticket ID directly from the URL
  // This avoids the complex type issue with 'params'
  const url = new URL(request.url);
  const ticketId = url.pathname.split('/')[3]; // Extracts the ID from /api/tickets/[ticketId]/...

  if (!ticketId) {
    return new NextResponse('Ticket ID is required', { status: 400 });
  }

  try {
    const body = await request.json();
    const { category, priority } = body;

    // 3. Basic validation for the received data
    if (!category || !priority || !Object.values(Category).includes(category) || !Object.values(Priority).includes(priority)) {
        return new NextResponse('Invalid category or priority', { status: 400 });
    }

    // 4. Update the ticket in the database
    const updatedTicket = await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        category,
        priority,
      },
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error('[CLASSIFY_TICKET_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
