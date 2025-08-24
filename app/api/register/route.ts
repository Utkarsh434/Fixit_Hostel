import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/app/lib/prisma';
import { UserRole } from '@prisma/client';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return new NextResponse('Missing fields', { status: 400 });
  }

  const exist = await prisma.user.findUnique({
    where: { email },
  });

  if (exist) {
    return new NextResponse('Email already exists', { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // All new users from this form are automatically assigned the STUDENT role.
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: UserRole.STUDENT,
    },
  });

  return NextResponse.json(user);
}
