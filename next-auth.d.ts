// next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "STUDENT" | "WARDEN" | string;
    id: string;
  }
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: "STUDENT" | "WARDEN" | string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "STUDENT" | "WARDEN" | string;
  }
}