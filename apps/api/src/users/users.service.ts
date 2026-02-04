import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'database';

// Define the User type based on your UserAdmin table schema
export interface UserAdmin {
  id: string;
  email: string;
  password: string;
  // Add other fields from your UserAdmin table as needed
}

@Injectable()
export class UsersService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findOne(id: string): Promise<UserAdmin | null> {
    const users = await this.prisma.$queryRaw<
      UserAdmin[]
    >`SELECT * FROM "UserAdmin" WHERE "id" = ${id}`;
    return users[0] ?? null;
  }

  async findByEmail(email: string): Promise<UserAdmin | null> {
    const users = await this.prisma.$queryRaw<
      UserAdmin[]
    >`SELECT * FROM "UserAdmin" WHERE "email" = ${email}`;
    return users[0] ?? null;
  }
}
