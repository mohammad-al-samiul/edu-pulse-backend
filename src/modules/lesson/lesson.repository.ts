import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";

const createLesson = async (data: Prisma.LessonCreateInput) => {
  return prisma.lesson.create({ data });
};

const findById = async (id: string) => {
  return prisma.lesson.findUnique({
    where: { id },
  });
};

const findByCourse = async (courseId: string) => {
  return prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
  });
};

export const LessonRepository = {
  createLesson,
  findById,
  findByCourse,
};
