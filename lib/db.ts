import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Support Vercel serverless /tmp writable SQLite
if (process.env.VERCEL) {
  try {
    const tmpDb = "/tmp/dev.db";
    const bundledDb = path.join(process.cwd(), "prisma", "dev.db");
    if (!fs.existsSync(tmpDb) && fs.existsSync(bundledDb)) {
      fs.copyFileSync(bundledDb, tmpDb);
    }
    process.env.DATABASE_URL = "file:/tmp/dev.db";
  } catch (e) {
    console.error("Vercel DB initialization error:", e);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
