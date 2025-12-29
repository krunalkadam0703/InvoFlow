import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const { Pool } = pg;

const poolSize = Number(process.env.PG_POOL_SIZE) || 5;
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: poolSize,
});

const adapter = new PrismaPg(pool);

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      adapter,
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.prisma;
}

process.on('beforeExit', async () => {
  await prisma.$disconnect();
  await pool.end();
});

export default prisma;
