export interface Course {
  id?: number;
  course_title: string;
  course_description: string;
  course_category: string;
  approved?: boolean;
  approver?: string;
}

export interface Lesson {
  id?: number;
  lesson_title: string;
  lesson_description: string;
  lesson_order: number;
  course_id?: string;
  approved?: boolean;
  approver?: string;
}

export interface Slide {
  id?: number;
  slide_title: string;
  slide_type: string;
  slide_content: string;
  slide_order: number;
  lesson_id?: string;
}
