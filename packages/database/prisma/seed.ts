import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin roles
  const superAdminRole = await prisma.adminRole.upsert({
    where: { name: 'super_admin' },
    update: {},
    create: {
      name: 'super_admin',
      description: 'Super Administrator with full access',
    },
  });

  await prisma.adminRole.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with limited access',
    },
  });

  await prisma.adminRole.upsert({
    where: { name: 'validator' },
    update: {},
    create: {
      name: 'validator',
      description: 'Entry validator',
    },
  });

  console.log('✅ Created admin roles');

  // Create permissions
  const permissions = [
    { code: 'MANAGE_USER', description: 'Manage users' },
    { code: 'VALIDATE_ENTRY', description: 'Validate entries' },
    { code: 'MANAGE_PRIZE', description: 'Manage prizes' },
    { code: 'MANAGE_ROLE', description: 'Manage roles and permissions' },
    { code: 'VIEW_ANALYTICS', description: 'View analytics and reports' },
  ];

  for (const perm of permissions) {
    await prisma.adminPermission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
  }

  console.log('✅ Created permissions');

  // Assign all permissions to super_admin
  const allPermissions = await prisma.adminPermission.findMany();
  
  for (const permission of allPermissions) {
    await prisma.adminRolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ Assigned permissions to super_admin');

  // Create sample replies
  // @ts-expect-error - Variable is kept for future use when admin user creation is implemented
  const _sampleReplies = [
    { code: 'WELCOME', content: 'Selamat datang di Smart Chatbot! 👋' },
    { code: 'HELP', content: 'Ketik "menu" untuk melihat daftar perintah yang tersedia.' },
    { code: 'INVALID_ENTRY', content: 'Maaf, entri Anda tidak valid. Silakan coba lagi.' },
    { code: 'SUCCESS_ENTRY', content: 'Terima kasih! Entri Anda telah berhasil dicatat.' },
  ];

  // Note: We need a default admin user to create replies
  // You can uncomment this after creating your first admin user
  // const defaultAdmin = await prisma.userAdmin.findFirst();
  // if (defaultAdmin) {
  //   for (const reply of _sampleReplies) {
  //     await prisma.reply.upsert({
  //       where: { code: reply.code },
  //       update: {},
  //       create: {
  //         ...reply,
  //         createdBy: defaultAdmin.id,
  //       },
  //     });
  //   }
  //   console.log('✅ Created sample replies');
  // }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
