import { PrismaClient } from "@prisma/client/edge";
import { createThoughtInput } from "./validations/thought";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient().$extends({
    query: {
      thought: {
        create: ({ args, query }) => {
          args.data = createThoughtInput.parse(args.data);
          return query(args);
        },
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
