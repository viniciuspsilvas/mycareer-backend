import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { join } from "path";

const prismaBinary = join(
  __dirname,
  "..",
  "..",
  "node_modules",
  ".bin",
  "prisma"
);

const url = process.env.DATABASE_URL;
export const prisma = new PrismaClient({
  datasources: { db: { url } }
});

beforeEach(() => {
  execSync(`${prismaBinary} db push --skip-generate`, {
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL
    }
  });
});
afterEach(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS CASCADE;`
  );
  await prisma.$disconnect();
});
