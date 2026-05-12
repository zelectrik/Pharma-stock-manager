/*
  Warnings:

  - You are about to drop the column `medicineProductId` on the `MedicineBatch` table. All the data in the column will be lost.
  - You are about to drop the column `threshold` on the `MedicineProduct` table. All the data in the column will be lost.
  - Added the required column `pharmacyMedicineId` to the `MedicineBatch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MedicineBatch" DROP CONSTRAINT "MedicineBatch_medicineProductId_fkey";

-- AlterTable
ALTER TABLE "MedicineBatch" DROP COLUMN "medicineProductId",
ADD COLUMN     "pharmacyMedicineId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MedicineProduct" DROP COLUMN "threshold";

-- CreateTable
CREATE TABLE "Pharmacy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'France',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pharmacy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PharmacyMedicine" (
    "id" TEXT NOT NULL,
    "pharmacyId" TEXT NOT NULL,
    "medicineProductId" TEXT NOT NULL,
    "threshold" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PharmacyMedicine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacy_email_key" ON "Pharmacy"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PharmacyMedicine_pharmacyId_medicineProductId_key" ON "PharmacyMedicine"("pharmacyId", "medicineProductId");

-- AddForeignKey
ALTER TABLE "PharmacyMedicine" ADD CONSTRAINT "PharmacyMedicine_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PharmacyMedicine" ADD CONSTRAINT "PharmacyMedicine_medicineProductId_fkey" FOREIGN KEY ("medicineProductId") REFERENCES "MedicineProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineBatch" ADD CONSTRAINT "MedicineBatch_pharmacyMedicineId_fkey" FOREIGN KEY ("pharmacyMedicineId") REFERENCES "PharmacyMedicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
