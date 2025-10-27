import prisma from './prisma';

const resetDb = async () => {
  await prisma.user.deleteMany();
};

export default resetDb;
