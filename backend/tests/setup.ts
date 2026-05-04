import { afterAll, beforeEach } from "vitest";
import { prisma } from "../src/lib/prisma";

beforeEach(async () => {
  await prisma.medicine.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
