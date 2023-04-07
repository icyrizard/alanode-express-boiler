-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "role" VARCHAR(12) NOT NULL,
    "firstName" VARCHAR(32) NOT NULL,
    "fullName" VARCHAR(64),
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lastName" VARCHAR(63) NOT NULL,
    "password" VARCHAR(255),
    "provider" VARCHAR(12),
    "resetPasswordToken" VARCHAR(64),
    "confirmationToken" VARCHAR(64),
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "bio" VARCHAR(63),
    "profilePictureMediaId" INTEGER,
    "lastActiveAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "modelName" VARCHAR(32),
    "modelId" INTEGER,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "parentId" INTEGER,
    "sizeName" VARCHAR(12),
    "width" INTEGER,
    "height" INTEGER,
    "originalFileName" VARCHAR(128) NOT NULL,
    "fullPath" TEXT NOT NULL,
    "fileName" VARCHAR(64) NOT NULL,
    "mimeType" VARCHAR(128) NOT NULL,
    "filesystem" VARCHAR(8) NOT NULL,
    "size" INTEGER NOT NULL,
    "order" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profilePictureMediaId_fkey" FOREIGN KEY ("profilePictureMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
