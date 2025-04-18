import { NextRequest, NextResponse } from "next/server";
import { generateLessonsFromCourseData } from "@/app/actions/generateLessonsFromCourseData";

export async function POST(req: NextRequest) {
  console.log("Received request to API");
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const lessonCount = parseInt(formData.get("lessonCount") as string, 10);

    const lessons = await generateLessonsFromCourseData({
      title,
      description,
      lessonCount,
    });

    return NextResponse.json(lessons);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Something went wrong on the server." },
      { status: 500 }
    );
  }
}
