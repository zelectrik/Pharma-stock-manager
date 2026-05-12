import { prisma } from "../../src/lib/prisma";

export const clearTestDatabase = async () => {
  await prisma.medicineBatch.deleteMany();
  await prisma.pharmacyMedicine.deleteMany();
  await prisma.medicineProduct.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pharmacy.deleteMany();
};
