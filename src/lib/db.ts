import { PrismaClient } from "@prisma/client";
import { createThoughtInput } from "./validations/thought";
import { createUserInput } from "./validations/user";
import { genSalt, hash } from "bcryptjs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient().$extends({
    query: {
      user: {
        create: async ({ args, query }) => {
          args.data = createUserInput.parse(args.data);
          const salt = await genSalt(10);
          args.data.password = await hash(args.data.password, salt);

          return query(args);
        },
      },
      thought: {
        create: ({ args, query }) => {
          args.data = createThoughtInput.parse(args.data);
          return query(args);
        },
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
