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

  // optional: clear first page cache only
  await CacheService.deleteCache("courses:list:page=1:limit=10");

  return course;
};
//////////////////////////////////////////////////
// GET ALL COURSES (Redis + Pagination + Count)
//////////////////////////////////////////////////

const getAllCourses = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const cacheKey = `courses:list:page=${page}:limit=${limit}`;

  const cached = await CacheService.getCache(cacheKey);
  if (cached !== null) return cached;

  const filter = { status: "PUBLISHED" };

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

  await CacheService.setCache(cacheKey, result, 120);

  return result;
};

//////////////////////////////////////////////////
// GET SINGLE COURSE
//////////////////////////////////////////////////

const getSingleCourse = async (id: string) => {
  const cacheKey = `course:${id}`;

  const cached = await CacheService.getCache(cacheKey);
  if (cached !== null) return cached;

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

  if (
    requester.role === "INSTRUCTOR" &&
    course.instructor.id !== requester.id
  ) {
    throw new AppError("Unauthorized", 403);
  }

  const updated = await CourseRepository.updateById(id, payload);

  await CacheService.deleteCache(`course:${id}`);

  return updated;
};

export const CourseService = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
};
