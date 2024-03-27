import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createUser(userInsert) {
  const cryptedPassword = await bcrypt.hash(userInsert.password, 10);
  userInsert.password = cryptedPassword;

  try {
    const user = await prisma.user.create({
      data: {
        name: userInsert.name,
        email: userInsert.email,
        password: userInsert.password,
      },
    });
    console.log("User created:", user);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser({
  name: "moi",
  email: "moi@email.com",
  password: "1234",
});