import { PrismaClient } from "@prisma/client/edge";
import { thoughtInput } from "./validations/thought";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient().$extends({
    query: {
      thought: {
        create: ({ args, query }) => {
          args.data = thoughtInput.parse(args.data);
          return query(args);
        },
        update: ({ args, query }) => {
          args.data = thoughtInput.partial().parse(args.data);
          return query(args);
        },
        updateMany: ({ args, query }) => {
          args.data = thoughtInput.partial().parse(args.data);
          return query(args);
        },
        upsert: ({ args, query }) => {
          args.create = thoughtInput.parse(args.create);
          args.update = thoughtInput.partial().parse(args.update);
          return query(args);
        },
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
