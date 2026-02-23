export interface ILesson {
  id: string;
  title: string;
  content?: string | null;
  videoUrl?: string | null;
  order: number;
  isPreview: boolean;
  courseId: string;
  createdAt: Date;
}

export interface ICreateLesson {
  title: string;
  content?: string;
  videoUrl?: string;
  order: number;
  isPreview?: boolean;
}
