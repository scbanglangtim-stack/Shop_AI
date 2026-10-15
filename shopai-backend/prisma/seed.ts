import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  // 1. Seed demo user
  await prisma.user.upsert({
    where: { email: 'demo@shopai.com' },
    update: {},
    create: {
      email: 'demo@shopai.com',
      password: hashedPassword,
      name: 'Học viên Demo',
    },
  });

  console.log('✅ Đã seed User demo: demo@shopai.com / 123456');

  // 2. Seed 20 products
  for (let i = 0; i < 20; i++) {
    await prisma.product.upsert({
      where: { id: `backend_prod_${i}` },
      update: {},
      create: {
        id: `backend_prod_${i}`,
        name: `Sản phẩm từ NestJS Server ${i}`,
        price: 1000000 + i * 10000,
        image: `https://picsum.photos/id/${200 + i}/400/400`,
      },
    });
  }
  console.log('✅ Đã seed 20 Product vào Database SQLite');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
