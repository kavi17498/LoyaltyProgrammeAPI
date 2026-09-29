import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial database state...');

  // 1. Seed System Settings
  const settings = await prisma.systemSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      earnPointsPerDollar: 1,
      pointsRedeemPerDollar: 100,
      minRedeemThresholdPoints: 500,
      standardVoucherRedeemLimit: 50.0,
      defaultRaffleThreshold: 25.0,
      defaultRafflePrize: 100.0,
    },
  });
  console.log('System settings initialized:', settings.id);

  // 2. Seed initial ADMIN user if not present
  const adminPasswordHash = await bcrypt.hash('Admin12345!', 12);
  const adminPinHash = await bcrypt.hash('1234', 12);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      pinHash: adminPinHash,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log(`Initial ADMIN user ready: ${admin.username} (ID: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
