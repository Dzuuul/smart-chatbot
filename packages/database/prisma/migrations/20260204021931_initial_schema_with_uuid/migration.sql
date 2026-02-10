-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('WHATSAPP', 'TELEGRAM', 'WEB');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('OPEN', 'CLOSED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('CONSUMER', 'BOT', 'ADMIN');

-- CreateEnum
CREATE TYPE "EntryStatus" AS ENUM ('PENDING', 'VALID', 'INVALID');

-- CreateEnum
CREATE TYPE "ValidationStatus" AS ENUM ('APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "user_consumers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "phone" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "platform" "Platform" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_consumers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_admins" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_permissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_user_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "adminId" UUID NOT NULL,
    "roleId" UUID NOT NULL,

    CONSTRAINT "admin_user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_role_permissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,

    CONSTRAINT "admin_role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userConsumerId" UUID NOT NULL,
    "channel" "Platform" NOT NULL,
    "status" "ConversationStatus" NOT NULL DEFAULT 'OPEN',
    "startedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMPTZ(3),

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversationId" UUID NOT NULL,
    "senderType" "SenderType" NOT NULL,
    "senderId" TEXT,
    "messageType" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "replies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userConsumerId" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "entryType" VARCHAR(100) NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "EntryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entryId" UUID NOT NULL,
    "validatedBy" UUID NOT NULL,
    "status" "ValidationStatus" NOT NULL,
    "notes" TEXT,
    "validatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "validations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "winners" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entryId" UUID NOT NULL,
    "userConsumerId" UUID NOT NULL,
    "prizeName" VARCHAR(255) NOT NULL,
    "announcedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "winners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whitelists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userConsumerId" UUID NOT NULL,
    "reason" TEXT,
    "createdBy" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whitelists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blacklists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userConsumerId" UUID NOT NULL,
    "reason" TEXT,
    "createdBy" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blacklists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_consumers_phone_key" ON "user_consumers"("phone");

-- CreateIndex
CREATE INDEX "user_consumers_phone_idx" ON "user_consumers"("phone");

-- CreateIndex
CREATE INDEX "user_consumers_email_idx" ON "user_consumers"("email");

-- CreateIndex
CREATE INDEX "user_consumers_platform_idx" ON "user_consumers"("platform");

-- CreateIndex
CREATE INDEX "user_consumers_createdAt_idx" ON "user_consumers"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_admins_email_key" ON "user_admins"("email");

-- CreateIndex
CREATE INDEX "user_admins_email_idx" ON "user_admins"("email");

-- CreateIndex
CREATE INDEX "user_admins_isActive_idx" ON "user_admins"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "admin_roles_name_key" ON "admin_roles"("name");

-- CreateIndex
CREATE INDEX "admin_roles_name_idx" ON "admin_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "admin_permissions_code_key" ON "admin_permissions"("code");

-- CreateIndex
CREATE INDEX "admin_permissions_code_idx" ON "admin_permissions"("code");

-- CreateIndex
CREATE INDEX "admin_user_roles_adminId_idx" ON "admin_user_roles"("adminId");

-- CreateIndex
CREATE INDEX "admin_user_roles_roleId_idx" ON "admin_user_roles"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_user_roles_adminId_roleId_key" ON "admin_user_roles"("adminId", "roleId");

-- CreateIndex
CREATE INDEX "admin_role_permissions_roleId_idx" ON "admin_role_permissions"("roleId");

-- CreateIndex
CREATE INDEX "admin_role_permissions_permissionId_idx" ON "admin_role_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_role_permissions_roleId_permissionId_key" ON "admin_role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "conversations_userConsumerId_idx" ON "conversations"("userConsumerId");

-- CreateIndex
CREATE INDEX "conversations_status_idx" ON "conversations"("status");

-- CreateIndex
CREATE INDEX "conversations_channel_idx" ON "conversations"("channel");

-- CreateIndex
CREATE INDEX "conversations_startedAt_idx" ON "conversations"("startedAt");

-- CreateIndex
CREATE INDEX "messages_conversationId_idx" ON "messages"("conversationId");

-- CreateIndex
CREATE INDEX "messages_senderType_idx" ON "messages"("senderType");

-- CreateIndex
CREATE INDEX "messages_createdAt_idx" ON "messages"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "replies_code_key" ON "replies"("code");

-- CreateIndex
CREATE INDEX "replies_code_idx" ON "replies"("code");

-- CreateIndex
CREATE INDEX "replies_isActive_idx" ON "replies"("isActive");

-- CreateIndex
CREATE INDEX "replies_createdBy_idx" ON "replies"("createdBy");

-- CreateIndex
CREATE INDEX "entries_userConsumerId_idx" ON "entries"("userConsumerId");

-- CreateIndex
CREATE INDEX "entries_conversationId_idx" ON "entries"("conversationId");

-- CreateIndex
CREATE INDEX "entries_status_idx" ON "entries"("status");

-- CreateIndex
CREATE INDEX "entries_entryType_idx" ON "entries"("entryType");

-- CreateIndex
CREATE INDEX "entries_createdAt_idx" ON "entries"("createdAt");

-- CreateIndex
CREATE INDEX "validations_entryId_idx" ON "validations"("entryId");

-- CreateIndex
CREATE INDEX "validations_validatedBy_idx" ON "validations"("validatedBy");

-- CreateIndex
CREATE INDEX "validations_status_idx" ON "validations"("status");

-- CreateIndex
CREATE INDEX "validations_validatedAt_idx" ON "validations"("validatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "winners_entryId_key" ON "winners"("entryId");

-- CreateIndex
CREATE INDEX "winners_userConsumerId_idx" ON "winners"("userConsumerId");

-- CreateIndex
CREATE INDEX "winners_announcedAt_idx" ON "winners"("announcedAt");

-- CreateIndex
CREATE UNIQUE INDEX "whitelists_userConsumerId_key" ON "whitelists"("userConsumerId");

-- CreateIndex
CREATE INDEX "whitelists_createdBy_idx" ON "whitelists"("createdBy");

-- CreateIndex
CREATE INDEX "whitelists_createdAt_idx" ON "whitelists"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "blacklists_userConsumerId_key" ON "blacklists"("userConsumerId");

-- CreateIndex
CREATE INDEX "blacklists_createdBy_idx" ON "blacklists"("createdBy");

-- CreateIndex
CREATE INDEX "blacklists_createdAt_idx" ON "blacklists"("createdAt");

-- AddForeignKey
ALTER TABLE "admin_user_roles" ADD CONSTRAINT "admin_user_roles_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user_admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_user_roles" ADD CONSTRAINT "admin_user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "admin_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role_permissions" ADD CONSTRAINT "admin_role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "admin_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role_permissions" ADD CONSTRAINT "admin_role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "admin_permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_userConsumerId_fkey" FOREIGN KEY ("userConsumerId") REFERENCES "user_consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user_admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entries" ADD CONSTRAINT "entries_userConsumerId_fkey" FOREIGN KEY ("userConsumerId") REFERENCES "user_consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entries" ADD CONSTRAINT "entries_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validations" ADD CONSTRAINT "validations_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validations" ADD CONSTRAINT "validations_validatedBy_fkey" FOREIGN KEY ("validatedBy") REFERENCES "user_admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "winners" ADD CONSTRAINT "winners_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "winners" ADD CONSTRAINT "winners_userConsumerId_fkey" FOREIGN KEY ("userConsumerId") REFERENCES "user_consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whitelists" ADD CONSTRAINT "whitelists_userConsumerId_fkey" FOREIGN KEY ("userConsumerId") REFERENCES "user_consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whitelists" ADD CONSTRAINT "whitelists_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user_admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blacklists" ADD CONSTRAINT "blacklists_userConsumerId_fkey" FOREIGN KEY ("userConsumerId") REFERENCES "user_consumers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blacklists" ADD CONSTRAINT "blacklists_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user_admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
