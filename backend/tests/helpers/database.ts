import { prisma } from "../../src/lib/prisma";

export const clearTestDatabase = async () => {
  await prisma.medicine.deleteMany();
};
