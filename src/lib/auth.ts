import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compareSync } from "bcryptjs";

import { prisma } from "./db";
import { userLoginInput } from "./validations/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { success, data } = userLoginInput.safeParse(credentials);

        if (!success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            username: data.username,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = compareSync(data.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
        };
      },
    }),
  ],
});
