import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

// This is the most robust way to define the DELETE function for Vercel builds
export async function DELETE(request: Request) {
  // 1. Get the session and check for Warden role
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'WARDEN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // 2. Extract the ticket ID directly from the URL
  // This avoids the complex type issue with 'params'
  const url = new URL(request.url);
  const ticketId = url.pathname.split('/')[3]; // Extracts the ID from /api/tickets/[ticketId]

  if (!ticketId) {
    return new NextResponse('Ticket ID is required', { status: 400 });
  }

  try {
    // 3. Delete the ticket from the database using its ID
    await prisma.ticket.delete({
      where: {
        id: ticketId,
      },
    });

    return NextResponse.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('[DELETE_TICKET_ERROR]', error);
    // Prisma will throw an error if the record to be deleted is not found
    if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
        return new NextResponse('Ticket not found', { status: 404 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

