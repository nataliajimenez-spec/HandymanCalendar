-- AlterTable
ALTER TABLE "units" ADD COLUMN     "guestyListingId" TEXT;

-- CreateTable
CREATE TABLE "guesty_reservations" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "guestyId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "guestName" TEXT,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guesty_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "units_guestyListingId_key" ON "units"("guestyListingId");

-- CreateIndex
CREATE UNIQUE INDEX "guesty_reservations_guestyId_key" ON "guesty_reservations"("guestyId");

-- CreateIndex
CREATE INDEX "guesty_reservations_unitId_idx" ON "guesty_reservations"("unitId");

-- CreateIndex
CREATE INDEX "guesty_reservations_checkIn_idx" ON "guesty_reservations"("checkIn");

-- CreateIndex
CREATE INDEX "guesty_reservations_checkOut_idx" ON "guesty_reservations"("checkOut");

-- AddForeignKey
ALTER TABLE "guesty_reservations" ADD CONSTRAINT "guesty_reservations_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;
