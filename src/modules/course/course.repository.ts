import prisma from "../../config/prisma";

//////////////////////////////////////////////////
// CREATE COURSE
//////////////////////////////////////////////////

const createCourse = async (payload: any) => {
  return prisma.course.create({
    data: payload,
  });
};

//////////////////////////////////////////////////
// GET ALL COURSES (Pagination + Count)
//////////////////////////////////////////////////

const findAllWithCount = async (filter: any, skip: number, take: number) => {
  const [data, total] = await Promise.all([
    prisma.course.findMany({
      where: filter,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.course.count({
      where: filter,
    }),
  ]);

  return { data, total };
};
//////////////////////////////////////////////////
// GET SINGLE COURSE
//////////////////////////////////////////////////

const findById = async (id: string) => {
  return prisma.course.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      category: true,
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

//////////////////////////////////////////////////
// UPDATE COURSE
//////////////////////////////////////////////////

const updateById = async (id: string, payload: any) => {
  return prisma.course.update({
    where: { id },
    data: payload,
  });
};

//////////////////////////////////////////////////
// SOFT DELETE COURSE
//////////////////////////////////////////////////

const softDelete = async (id: string) => {
  return prisma.course.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const CourseRepository = {
  createCourse,
  findAllWithCount,
  findById,
  updateById,
  softDelete,
};
