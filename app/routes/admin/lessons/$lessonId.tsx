
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
      include: {
        award: true
      }
  });
  if (!lesson) throw new Error("Lesson not found");
  const data: LoaderData = { lesson };
  return json(data);
};

export default function LessonRoute() {
    const data = useLoaderData<LoaderData>();
    return (
      <div>
        <h2>Selected: {data.lesson.award.name}</h2>
        <h3>Description: {data.lesson.award.description}</h3>
        <p>Instructor: {data.lesson.instructor}</p>
        <p>Available Spots: {data.lesson.availableSpots}</p>
        <p>Class Duration: {data.lesson.classMinutes}</p>
        <p>Total Hour Commitment: {data.lesson.totalHours}</p>
        <p> Cost: ${data.lesson.lessonCost} CAD</p>
        <Link to={"/"}> Home </Link>
      </div>
    );
  }