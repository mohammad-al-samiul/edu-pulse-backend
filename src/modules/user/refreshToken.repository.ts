import prisma from "../../config/prisma";

const createToken = async (token: string, userId: string, expiresAt: Date) => {
  return prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};

const findToken = async (token: string) => {
  return prisma.refreshToken.findUnique({
    where: { token },
  });
};

const deleteToken = async (token: string) => {
  return prisma.refreshToken.deleteMany({
    where: { token },
  });
};

export const RefreshTokenRepository = {
  createToken,
  findToken,
  deleteToken,
};
