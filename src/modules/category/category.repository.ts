import prisma from "../../config/prisma";

const createCategory = async (payload: { name: string }) => {
  return prisma.category.create({
    data: payload,
  });
};

const findAll = async () => {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const findById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
  });
};

const updateById = async (id: string, payload: any) => {
  return prisma.category.update({
    where: { id },
    data: payload,
  });
};

const deleteById = async (id: string) => {
  return prisma.category.delete({
    where: { id },
  });
};

export const CategoryRepository = {
  createCategory,
  findAll,
  findById,
  updateById,
  deleteById,
};
