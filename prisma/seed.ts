import { PrismaClient } from "../app/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@spendi.com";

  await prisma.user.delete({ where: { email } }).catch(() => {});

  const hashedPassword = await bcrypt.hash("test1234", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });

  const housing = await prisma.category.create({
    data: {
      name: "Housing",
      color: "#719e91",
      userId: user.id
    }
  });

  await prisma.category.create({
    data: {
      name: "Transportation",
      color: "#bada55",
      userId: user.id
    }
  });

  await prisma.category.create({
    data: {
      name: "Food",
      color: "#00ff00",
      userId: user.id
    }
  });

  await prisma.category.create({
    data: {
      name: "Utilities",
      color: "#aaaaff",
      userId: user.id
    }
  });

  await prisma.expense.create({
    data: {
      item: "Rent",
      value: 1200,
      userId: user.id,
      categoryId: housing.id
    }
  });
}

seed();
