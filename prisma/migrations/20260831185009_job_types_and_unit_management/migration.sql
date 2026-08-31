-- CreateEnum
CREATE TYPE "ManagementType" AS ENUM ('LONG_TERM', 'SHORT_TERM');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "jobTypeId" TEXT;

-- AlterTable
ALTER TABLE "units" ADD COLUMN     "managementType" "ManagementType" NOT NULL DEFAULT 'LONG_TERM';

-- CreateTable
CREATE TABLE "job_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_types_name_key" ON "job_types"("name");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_jobTypeId_fkey" FOREIGN KEY ("jobTypeId") REFERENCES "job_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
