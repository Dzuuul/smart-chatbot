import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'database';

// Define the User type based on your UserAdmin table schema
export interface UserAdmin {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  hashedRefreshToken: string | null;
  // Add other fields from your UserAdmin table as needed
}

@Injectable()
export class UsersService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findOneUserAdmin(id: string): Promise<UserAdmin | null> {
    const users = await this.prisma.$queryRaw<
      UserAdmin[]
    >`SELECT * FROM "user_admins" WHERE "id" = ${id}::uuid`;
    return users[0] ?? null;
  }

  async findByEmailUserAdmin(email: string): Promise<UserAdmin | null> {
    const users = await this.prisma.$queryRaw<
      UserAdmin[]
    >`SELECT * FROM "user_admins" WHERE "email" = ${email}`;
    return users[0] ?? null;
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const roles = await this.prisma.$queryRaw<{ name: string }[]>`
      SELECT ar.name
      FROM "admin_user_roles" aur
      JOIN "admin_roles" ar ON aur."roleId" = ar.id
      WHERE aur."adminId" = ${userId}::uuid
    `;
    return roles.map((role) => role.name);
  }

  async createUserAdmin(
    email: string,
    passwordHash: string,
    name: string,
  ): Promise<UserAdmin> {
    const users = await this.prisma.$queryRaw<UserAdmin[]>`
      INSERT INTO "user_admins" ("email", "passwordHash", "name")
      VALUES (${email}, ${passwordHash}, ${name})
      RETURNING *
    `;
    return users[0];
  }

  async updateRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    await this.prisma.$executeRaw`
      UPDATE "user_admins"
      SET "hashedRefreshToken" = ${hashedRefreshToken}
      WHERE "id" = ${userId}::uuid
    `;
  }
}
