import "dotenv/config";
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from "../generated";

const adapter = new PrismaLibSql({ url: `${process.env.DATABASE_URL}` });
// const adapter = new PrismaBetterSqlite3({ url: "file:./data.db" });
const prisma = new PrismaClient({ adapter });

export { prisma };
