"use server";
import { createClient } from "@/utils/supabase/server";
import { Course, Lesson } from "@/types/courses";
import { LessonModule } from "@/types/lesson-modules";

export async function addCourseService(course: Course): Promise<Course | null> {
  const supabase = createClient();

  const { data, error } = await (
    await supabase
  )
    .from("courses")
    .insert({
      ...course,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error adding course:", error);
    return null;
  }
  if (!data) {
    console.error("No data returned from database");
    return null;
  }

  return data;
}

export async function getCoursesService(): Promise<Course[] | null> {
  const supabase = createClient();

  const { data, error } = await (await supabase).from("courses").select("*");

  if (error) {
    console.error("Error fetching courses:", error);
    return null;
  }
  if (!data) {
    console.error("No data returned from database");
    return null;
  }

  return data;
}

export async function getLessonsByCourseId(
  course_id: string
): Promise<Lesson[] | null> {
  const supabase = createClient();

  const { data, error } = await (await supabase)
    .from("lessons")
    .select("*")
    .eq("course_id", course_id);

  if (error) {
    console.error("Error fetching lessons:", error);
    return null;
  }
  if (!data) {
    console.error("No lessons returned from database");
    return null;
  }

  return data;
}

export async function addLesson(lesson: Lesson, course_id: string) {
  const supabase = createClient();

  const { data, error } = await (
    await supabase
  )
    .from("lessons")
    .insert({
      ...lesson,
      course_id: course_id,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error adding lesson:", error);
    return null;
  }
  if (!data) {
    console.error("No data returned from database");
    return null;
  }

  return data;
}

export async function getCourseByIdService(id: string): Promise<Course | null> {
  const supabase = createClient();

  const { data, error } = await (await supabase)
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching course by ID:", error);
    return null;
  }
  if (!data) {
    console.error("No data returned from database");
    return null;
  }

  return data;
}

export async function getLessonByIdService(id: string): Promise<Lesson | null> {
  const supabase = createClient();

  const { data, error } = await (await supabase)
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching lesson by ID:", error);
    return null;
  }
  if (!data) {
    console.error("No data returned from database");
    return null;
  }

  return data;
}

export async function updateLessonsService(
  courseId: string,
  lessons: Lesson[]
) {
  const supabase = createClient();

  const client = await supabase;
  const { error } = await client
    .from("lessons")
    .upsert(lessons.map((lesson) => ({ ...lesson, course_id: courseId })));

  if (error) {
    console.error("Error updating lessons:", error);
    throw error;
  }
}

export async function getSlidesByLessonId(
  lesson_id: string
): Promise<LessonModule[] | null> {
  const supabase = createClient();

  const { data, error } = await (await supabase)
    .from("slides")
    .select("*")
    .eq("lesson_id", lesson_id);

  if (error) {
    console.error("Error fetching lessons:", error);
    return null;
  }
  if (!data) {
    console.error("No lessons returned from database");
    return null;
  }

  return data;
}

export async function addSlide(slide: LessonModule, lesson_id: string) {
  const supabase = createClient();

  const { data, error } = await (
    await supabase
  )
    .from("slides")
    .insert({
      ...slide,
      lesson_id: lesson_id,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error adding lesson:", error);
    return null;
  }
  if (!data) {
    console.error("No data returned from database");
    return null;
  }

  return data;
}

export async function updateSlideService(slide: LessonModule) {
  const supabase = createClient();

  const client = await supabase;
  const { error } = await client
    .from("slides")
    .update({
      question: slide.question,
      content: slide.content,
    })
    .eq("id", slide.id);

  if (error) {
    console.error("Error updating slide:", error);
    throw error;
  }
}
