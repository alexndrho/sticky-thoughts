import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP, username } from "better-auth/plugins";

import { prisma } from "./db";
import { resend } from "./email";
import EmailOTPTemplate from "@/components/emails/EmailOTPTemplate";

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
  plugins: [
    username(),
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await resend.emails.send({
          from: "StickyThoughts <no-reply@mail.alexanderho.dev>",
          to: email,
          subject: `${otp} is your StickyThoughts verification code`,
          react: EmailOTPTemplate({ email, otp, type }),
        });
      },
    }),
  ],
});
