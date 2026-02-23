import prisma from "../../config/prisma";
import { EnrollmentRepository } from "./enrollment.repository";
import { CourseRepository } from "../course/course.repository";
import { publishEvent } from "../../queue/publisher";
import { CacheService } from "../../redis/cache.service";
import { AppError } from "../../errors/AppError";
import { IEnrollment } from "./enrollment.interface";

const enrollCourse = async (
  courseId: string,
  studentId: string,
): Promise<IEnrollment> => {
  const existing = await EnrollmentRepository.findExisting(studentId, courseId);

  if (existing) {
    throw new AppError("Already enrolled", 400);
  }

  const course = await CourseRepository.findById(courseId);

  if (!course || course.status !== "PUBLISHED") {
    throw new AppError("Course not available", 400);
  }

  const result = await prisma.$transaction(async (tx) => {
    const enrollment = await EnrollmentRepository.createEnrollment(
      {
        student: { connect: { id: studentId } },
        course: { connect: { id: courseId } },
        progress: 0,
        status: "ACTIVE",
      },
      tx,
    );

    await tx.course.update({
      where: { id: courseId },
      data: {
        totalEnrollments: { increment: 1 },
      },
    });

    return enrollment;
  });

  // Redis Invalidate
  await CacheService.deleteCache(`course:${courseId}`);

  // RabbitMQ Publish
  await publishEvent("enrollment.created", {
    courseId,
    studentId,
  });

  return result as IEnrollment;
};

export const EnrollmentService = {
  enrollCourse,
};
