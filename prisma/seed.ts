import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Initializing system settings...');

  // 1. Initialize System Settings
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

  // 2. Only seed admin if explicitly configured via environment variables
  const initialUsername = process.env.ADMIN_INITIAL_USERNAME;
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
  const initialPin = process.env.ADMIN_INITIAL_PIN;

  if (initialUsername && initialPassword) {
    const passwordHash = await bcrypt.hash(initialPassword, 12);
    const pinHash = initialPin ? await bcrypt.hash(initialPin, 12) : null;

    const admin = await prisma.user.upsert({
      where: { username: initialUsername },
      update: {
        passwordHash,
        pinHash,
        role: 'ADMIN',
        isActive: true,
      },
      create: {
        username: initialUsername,
        passwordHash,
        pinHash,
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log(`Initial ADMIN configured via environment: ${admin.username}`);
  } else {
    console.log('No hardcoded credentials. Use POST /auth/setup API to create initial administrator.');
  }
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
