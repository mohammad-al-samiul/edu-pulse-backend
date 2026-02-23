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

//////////////////////////////////////////////////
// GET ALL COURSES (Cursor + Page Support)
//////////////////////////////////////////////////

const getAllCourses = async (query: any) => {
  const limit = Number(query.limit) || 10;
  const cursor = query.cursor;
  const page = Number(query.page) || 1;

  //////////////////////////////////////////////////
  // FILTER
  //////////////////////////////////////////////////
  const filter: any = {
    deletedAt: null,
  };

  // Dynamic status
  if (query.status) {
    filter.status = query.status;
  }

  if (query.categoryId) {
    filter.categoryId = query.categoryId;
  }

  if (query.search) {
    filter.title = {
      contains: query.search,
      mode: "insensitive",
    };
  }

  //////////////////////////////////////////////////
  // SORTING
  //////////////////////////////////////////////////
  const allowedSortFields = ["price", "createdAt", "totalEnrollments"];

  const orderBy = allowedSortFields.includes(query.sortBy)
    ? {
        [query.sortBy]: query.order === "asc" ? "asc" : "desc",
      }
    : { createdAt: "desc" };

  //////////////////////////////////////////////////
  // 1️⃣ Cursor Based Pagination
  //////////////////////////////////////////////////
  if (cursor) {
    const courses = await CourseRepository.findWithCursor(
      filter,
      cursor,
      limit,
      orderBy,
    );

    let nextCursor = null;

    if (courses.length > limit) {
      const nextItem = courses.pop();
      nextCursor = nextItem?.id;
    }

    return {
      mode: "cursor",
      data: courses,
      nextCursor,
    };
  }

  //////////////////////////////////////////////////
  // 2️⃣ Page Based Pagination
  //////////////////////////////////////////////////
  const skip = (page - 1) * limit;

  const { data, total } = await CourseRepository.findAllWithCount(
    filter,
    skip,
    limit,
    orderBy,
  );

  return {
    mode: "page",
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
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
