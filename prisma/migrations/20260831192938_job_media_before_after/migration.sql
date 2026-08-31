-- CreateEnum
CREATE TYPE "MediaPhase" AS ENUM ('BEFORE', 'AFTER', 'OTHER');

-- AlterTable
ALTER TABLE "job_media" ADD COLUMN     "phase" "MediaPhase" NOT NULL DEFAULT 'OTHER';
