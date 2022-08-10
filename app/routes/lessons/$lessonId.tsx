
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Lesson } from "@prisma/client";
import { db } from "~/utils/db.server";

type LoaderData = { lesson: Lesson };

export const loader: LoaderFunction = async ({
  params
}) => {
  const lesson = 
     await db.lesson.findUnique({
      where: {id: params.lessonId},
  });
  if (!lesson) throw new Error("Lesson not found");
  const data: LoaderData = { lesson };
  return json(data);
};

export default function LessonRoute() {
    const data = useLoaderData<LoaderData>();
    return (
      <div>
        <h2>Selected: {data.lesson.name}</h2>
        <Link to={"/"}> Home </Link>
      </div>
    );
  }