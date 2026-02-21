import prisma from "../../config/prisma";

const baseWhere = {
  OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }],
};

// Create
const createUser = async (payload: any) => {
  return prisma.user.create({
    data: payload,
  });
};

// Login use case (password needed)
const findByEmailWithPassword = async (email: string) => {
  return prisma.user.findFirst({
    where: {
      email,
      ...baseWhere,
    },
  });
};

// Safe fetch (no password exposure)
const findSafeById = async (id: string) => {
  return prisma.user.findFirst({
    where: {
      id,
      ...baseWhere,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
};

// Get all users (safe version)
const findAllSafe = async () => {
  return prisma.user.findMany({
    where: baseWhere,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
};

// Update (prevent password override unless explicitly allowed)
const updateById = async (id: string, payload: any) => {
  return prisma.user.update({
    where: { id },
    data: payload,
  });
};

// Soft delete
const softDelete = async (id: string) => {
  return prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const UserRepository = {
  createUser,
  findByEmailWithPassword,
  findSafeById,
  findAllSafe,
  updateById,
  softDelete,
};
