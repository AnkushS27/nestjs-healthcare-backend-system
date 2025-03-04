-- CreateEnum
CREATE TYPE "PolicyEffect" AS ENUM ('ALLOW', 'DENY');

-- CreateTable
CREATE TABLE "AccessPolicy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "effect" "PolicyEffect" NOT NULL DEFAULT 'ALLOW',
    "resources" TEXT[],
    "actions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessPolicy_name_key" ON "AccessPolicy"("name");
