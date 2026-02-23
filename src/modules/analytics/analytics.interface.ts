export interface IAnalyticsSummary {
  totalCourses: number;
  totalActiveStudents: number;
}

export interface IEnrollmentGrowth {
  date: string;
  count: number;
}

export interface IPopularCourse {
  id: string;
  title: string;
  totalEnrollments: number;
}

export interface IRevenuePerCourse {
  id: string;
  title: string;
  totalRevenue: number;
}
