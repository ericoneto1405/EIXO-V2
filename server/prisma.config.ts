import path from 'node:path';
import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

const isServerCwd = path.basename(process.cwd()) === 'server';
const envPath = isServerCwd ? '.env' : 'server/.env';
const envLocalPath = isServerCwd ? '.env.local' : 'server/.env.local';

dotenv.config({ path: envPath });
dotenv.config({ path: envLocalPath });

const schemaPath = isServerCwd ? 'prisma/schema.prisma' : 'server/prisma/schema.prisma';
const seedPath = isServerCwd ? 'node prisma/seed.js' : 'node server/prisma/seed.js';

export default defineConfig({
  schema: schemaPath,
  migrations: {
    seed: seedPath,
  },
});
