import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";

import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const username =
            (user as unknown as { username: string }).username || "";

          if (!username) {
            throw new APIError("BAD_REQUEST", {
              message: "Username is required",
            });
          }
        },
      },
    },
  },
  plugins: [username(), nextCookies()],
});
