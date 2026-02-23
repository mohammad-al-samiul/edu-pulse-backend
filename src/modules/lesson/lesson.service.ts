import prisma from "../../config/prisma";
import { LessonRepository } from "./lesson.repository";
import { AppError } from "../../errors/AppError";
import { CacheService } from "../../redis/cache.service";

//////////////////////////////////////////////////
// CREATE LESSON
//////////////////////////////////////////////////

const createLesson = async (payload: any, instructorId: string) => {
  const course = await prisma.course.findUnique({
    where: { id: payload.courseId },
  });

  if (!course) throw new AppError("Course not found", 404);

  if (course.instructorId !== instructorId) {
    throw new AppError("Unauthorized", 403);
  }

  const lesson = await LessonRepository.createLesson({
    ...payload,
    course: { connect: { id: payload.courseId } },
  });

  // Update totalLessons
  await prisma.course.update({
    where: { id: payload.courseId },
    data: {
      totalLessons: { increment: 1 },
    },
  });

  await CacheService.deleteCache(`course:${payload.courseId}`);

  return lesson;
};

//////////////////////////////////////////////////
// MARK LESSON COMPLETE (Progress Engine)
//////////////////////////////////////////////////

const markLessonComplete = async (lessonId: string, studentId: string) => {
  const lesson = await LessonRepository.findById(lessonId);
  if (!lesson) throw new AppError("Lesson not found", 404);

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: lesson.courseId,
      },
    },
  });

  if (!enrollment) throw new AppError("Not enrolled", 400);

  const totalLessons = await prisma.lesson.count({
    where: { courseId: lesson.courseId },
  });

  const completedLessons = Math.floor(
    (enrollment.progress / 100) * totalLessons,
  );

  const newCompleted = completedLessons + 1;

  const newProgress = Number(((newCompleted / totalLessons) * 100).toFixed(2));

  const status = newProgress >= 100 ? "COMPLETED" : "ACTIVE";

  const updated = await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progress: newProgress,
      status,
      completedAt: newProgress >= 100 ? new Date() : null,
    },
  });

  return updated;
};

export const LessonService = {
  createLesson,
  markLessonComplete,
};
