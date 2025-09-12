import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { Category, Priority } from '@prisma/client';

export async function PUT(
  request: Request,
  { params }: { params: { ticketId: string } }
) {
  // 1. Check if the user is a logged-in warden
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'WARDEN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // 2. Get the new category and priority from the request body
  const body = await request.json();
  const { category, priority } = body;

  // Basic validation
  if (!category || !priority) {
    return new NextResponse('Missing category or priority', { status: 400 });
  }

  try {
    // 3. Update the ticket in the database
    const updatedTicket = await prisma.ticket.update({
      where: {
        id: params.ticketId,
      },
      data: {
        category: category as Category,
        priority: priority as Priority,
      },
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error('[CLASSIFY_TICKET_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
