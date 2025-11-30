import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// import pg from "pg";
import { createThoughtInput } from "./validations/thought";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Initialize PostgreSQL adapter with Direct TCP
// const pool = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
// });
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter }).$extends({
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
