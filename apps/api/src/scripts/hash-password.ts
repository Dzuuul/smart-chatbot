import { NestFactory } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';
import { AppModule } from '../app.module';

/**
 * Script helper untuk hash password
 *
 * Usage:
 * pnpm ts-node src/scripts/hash-password.ts yourpassword
 */
async function hashPassword() {
  const password = process.argv[2];

  if (!password) {
    console.error(
      'Usage: pnpm ts-node src/scripts/hash-password.ts <password>',
    );
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  const hashedPassword = await authService.hashPassword(password);

  console.log('\n=================================');
  console.log('Password:', password);
  console.log('Hashed:', hashedPassword);
  console.log('=================================\n');

  await app.close();
}

void hashPassword();
