import prisma from "../../config/prisma";

const getTotalCourses = async () => {
  return prisma.course.count({
    where: { deletedAt: null },
  });
};

const getTotalActiveStudents = async () => {
  return prisma.user.count({
    where: {
      role: "STUDENT",
      status: "ACTIVE",
      deletedAt: null,
    },
  });
};

const getEnrollmentGrowthLast10Days = async () => {
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  return prisma.enrollment.groupBy({
    by: ["enrolledAt"],
    where: {
      enrolledAt: {
        gte: tenDaysAgo,
      },
    },
    _count: {
      id: true,
    },
  });
};

const getTop5PopularCourses = async () => {
  return prisma.course.findMany({
    where: { deletedAt: null },
    orderBy: {
      totalEnrollments: "desc",
    },
    take: 5,
    select: {
      id: true,
      title: true,
      totalEnrollments: true,
    },
  });
};

const getRevenuePerCourse = async () => {
  return prisma.course.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      title: true,
      totalRevenue: true,
    },
  });
};

const getCompletionRatePerInstructor = async () => {
  return prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    select: {
      id: true,
      name: true,
      courses: {
        select: {
          enrollments: {
            select: { status: true },
          },
        },
      },
    },
  });
};

export const AnalyticsRepository = {
  getTotalCourses,
  getTotalActiveStudents,
  getEnrollmentGrowthLast10Days,
  getTop5PopularCourses,
  getRevenuePerCourse,
  getCompletionRatePerInstructor,
};
