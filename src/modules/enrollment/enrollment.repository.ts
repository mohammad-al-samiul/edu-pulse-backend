import prisma from "../../config/prisma";
import { IEnrollment } from "./enrollment.interface";
import { Prisma } from "@prisma/client";

const findExisting = async (
  studentId: string,
  courseId: string,
): Promise<IEnrollment | null> => {
  return prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
  }) as any;
};

const createEnrollment = async (
  data: Prisma.EnrollmentCreateInput,
  tx: Prisma.TransactionClient,
) => {
  return tx.enrollment.create({ data });
};

export const EnrollmentRepository = {
  findExisting,
  createEnrollment,
};
