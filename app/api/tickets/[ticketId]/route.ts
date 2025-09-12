import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { ticketId: string } }
) {
  // 1. Check if the user is a logged-in warden
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'WARDEN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 2. Delete the ticket from the database using its ID
    await prisma.ticket.delete({
      where: {
        id: params.ticketId,
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
