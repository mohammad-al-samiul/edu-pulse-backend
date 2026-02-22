import { CourseRepository } from "./course.repository";
import { CacheService } from "../../redis/cache.service";
import { publishEvent } from "../../queue/publisher";
import { AppError } from "../../errors/AppError";

//////////////////////////////////////////////////
// CREATE COURSE
//////////////////////////////////////////////////

const createCourse = async (payload: any, instructorId: string) => {
  const course = await CourseRepository.createCourse({
    ...payload,
    instructorId,
    deletedAt: null,
  });

  // Cache version bump
  const currentVersion = (await CacheService.getCache("courses:version")) || 1;

  await CacheService.setCache("courses:version", currentVersion + 1);

  // Publish event (non-blocking safe)
  try {
    await publishEvent("course.created", {
      courseId: course.id,
      instructorId,
    });
  } catch (err) {
    console.error("Event publish failed:", err);
  }

  return course;
};

//////////////////////////////////////////////////
// GET ALL COURSES (Redis + Pagination + Count)
//////////////////////////////////////////////////

const getAllCourses = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  //  Get version for cache consistency
  const version = (await CacheService.getCache("courses:version")) || 1;

  const cacheKey = `courses:list:v${version}:page=${page}:limit=${limit}`;

  const cached = await CacheService.getCache(cacheKey);
  if (cached) return cached;

  const filter = {
    status: "PUBLISHED",
  };

  const { data, total } = await CourseRepository.findAllWithCount(
    filter,
    skip,
    limit,
  );

  const result = {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };

  await CacheService.setCache(cacheKey, result, 300);

  return result;
};

//////////////////////////////////////////////////
// GET SINGLE COURSE
//////////////////////////////////////////////////

const getSingleCourse = async (id: string) => {
  const cacheKey = `course:${id}`;

  const cached = await CacheService.getCache(cacheKey);
  if (cached) return cached;

  const course = await CourseRepository.findById(id);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  await CacheService.setCache(cacheKey, course, 300);

  return course;
};

//////////////////////////////////////////////////
// UPDATE COURSE
//////////////////////////////////////////////////

const updateCourse = async (id: string, payload: any, requester: any) => {
  const course = await CourseRepository.findById(id);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  //  Ownership check
  if (
    requester.role === "INSTRUCTOR" &&
    course.instructor.id !== requester.id
  ) {
    throw new AppError("Unauthorized", 403);
  }

  const updated = await CourseRepository.updateById(id, payload);

  // Version bump
  const currentVersion = (await CacheService.getCache("courses:version")) || 1;

  await CacheService.setCache("courses:version", currentVersion + 1);

  // Clear single cache
  await CacheService.deleteCache(`course:${id}`);

  return updated;
};

export const CourseService = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
};
