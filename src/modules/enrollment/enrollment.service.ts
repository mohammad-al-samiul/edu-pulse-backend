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
  //  Check existing enrollment
  const existing = await EnrollmentRepository.findExisting(studentId, courseId);

  if (existing) {
    throw new AppError("Already enrolled", 400);
  }

  //   Check course availability
  const course = await CourseRepository.findById(courseId);

  if (!course || course.status !== "PUBLISHED") {
    throw new AppError("Course not available", 400);
  }

  // Transaction (DB Safe Zone)
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

  /////////////////////////////////////////////////////////
  // 🔥 External Services (Should NOT break API)
  /////////////////////////////////////////////////////////

  // Redis Invalidate (Safe)
  try {
    await CacheService.deleteCache(`course:${courseId}`);
  } catch (error) {
    console.error("Redis cache delete failed:", error);
  }

  // RabbitMQ Publish (Safe)
  try {
    await publishEvent("enrollment.created", {
      courseId,
      studentId,
    });
  } catch (error) {
    console.error("RabbitMQ publish failed:", error);
  }

  return result as IEnrollment;
};

export const EnrollmentService = {
  enrollCourse,
};
