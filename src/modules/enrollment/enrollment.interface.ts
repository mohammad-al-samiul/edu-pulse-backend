export type TEnrollmentStatus = "ACTIVE" | "COMPLETED" | "DROPPED";

export interface IEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  progress: number;
  status: TEnrollmentStatus;
  enrolledAt: Date;
  completedAt?: Date | null;
}

export interface ICreateEnrollment {
  studentId: string;
  courseId: string;
}
