import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

// GET function to fetch all users with the 'TECHNICIAN' role
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  // Protect the route and ensure user is a WARDEN
  if (!session?.user?.id || session.user.role !== 'WARDEN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const technicians = await prisma.user.findMany({
    where: {
      role: 'TECHNICIAN',
    },
    select: { // Only send back necessary, non-sensitive data
      id: true,
      name: true,
    },
  });

  return NextResponse.json(technicians);
}
