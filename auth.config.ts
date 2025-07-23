import Credentials from "next-auth/providers/credentials";

import type { NextAuthConfig } from "next-auth";

import { LoginSchema } from "./schemas/auth";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const existingUser = await db.user.findUnique({
            where: {
              email,
            },
          });

          if (!existingUser || !existingUser.password) return null;

          const passwordMatch = await bcrypt.compare(
            password,
            existingUser.password
          );

          if (passwordMatch) return existingUser;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
