import { prisma } from "../../src/lib/prisma";

export const clearTestDatabase = async () => {
  await prisma.medicineBatch.deleteMany();
  await prisma.medicineProduct.deleteMany();
};
