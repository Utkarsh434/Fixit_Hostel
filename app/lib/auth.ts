// app/lib/auth.ts
import { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // Warden
        if (credentials.email === process.env.WARDEN_EMAIL) {
          if (credentials.password === process.env.WARDEN_PASSWORD) {
            let wardenUser = await prisma.user.findUnique({
              where: { email: process.env.WARDEN_EMAIL },
            });
            if (!wardenUser) {
              wardenUser = await prisma.user.create({
                data: {
                  name: 'Hostel Warden',
                  email: process.env.WARDEN_EMAIL!,
                  password: await bcrypt.hash(process.env.WARDEN_PASSWORD!, 10),
                  role: 'WARDEN',
                },
              });
            }
            return wardenUser;
          }
          throw new Error('Invalid credentials');
        }

        // Regular user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) throw new Error('Invalid credentials');

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) throw new Error('Invalid credentials');

        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // user is the object returned from authorize()
        const u = user as { id: string; role: string };
        token.id = u.id;
        token.role = u.role;
      }
      return token; // token now has id/role due to module augmentation
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};
