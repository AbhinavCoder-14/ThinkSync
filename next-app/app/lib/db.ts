// next-app/app/lib/db.ts
import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Test database connection on startup
async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    console.error("Make sure your database is running and DATABASE_URL is correct");
    console.error("Current DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
  }
}

// Test connection when the module is imported (but don't await it to avoid blocking)
if (process.env.NODE_ENV === 'development') {
  testConnection();
}

export default prisma;