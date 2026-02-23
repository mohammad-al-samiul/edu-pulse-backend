import { AnalyticsRepository } from "./analytics.repository";

const getSummary = async () => {
  const totalCourses = await AnalyticsRepository.getTotalCourses();

  const totalActiveStudents =
    await AnalyticsRepository.getTotalActiveStudents();

  return {
    totalCourses,
    totalActiveStudents,
  };
};

const getEnrollmentGrowth = async () => {
  return AnalyticsRepository.getEnrollmentGrowthLast10Days();
};

const getTopCourses = async () => {
  return AnalyticsRepository.getTop5PopularCourses();
};

const getRevenue = async () => {
  return AnalyticsRepository.getRevenuePerCourse();
};

const getCompletionRate = async () => {
  return AnalyticsRepository.getCompletionRatePerInstructor();
};

export const AnalyticsService = {
  getSummary,
  getEnrollmentGrowth,
  getTopCourses,
  getRevenue,
  getCompletionRate,
};
