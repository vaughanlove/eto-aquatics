
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
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

export const action: ActionFunction = async ({
  request,
}) => {

  const form = await request.formData();
  const availableSpots = parseInt(form.get("availableSpots"));
  const instructor = form.get("instructor");
  const classMinutes = parseInt(form.get("classMinutes"));
  const totalHours = parseInt(form.get("totalHours"));
  const lessonCost = parseInt(form.get("lessonCost"))
  const lessonId = form.get("lessonId")
  
  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (
    typeof availableSpots !== "number" ||
    typeof classMinutes !== "number" ||
    typeof totalHours !== "number" ||
    typeof lessonId !== "string"
  ) {
    console.log()
    throw new Error(`Form not submitted correctly.`);
  }

  const lesson = await db.lesson.update({data: {availableSpots: availableSpots, instructor: instructor, classMinutes: classMinutes,totalHours: totalHours, lessonCost: lessonCost}, where: {id: lessonId}, select: {id: true}})
  return redirect(`/admin/lessons/${lesson.id}`);
};

export default function LessonRoute() {
    const data = useLoaderData<LoaderData>();
    return (
      <div>
        <form method="post">
        <div>
          <label>
           <input type="hidden" name="lessonId" defaultValue={data.lesson.id} />
          </label>
        </div>
        <div>
          <label>
            Available Spots: <input type="text" name="availableSpots" defaultValue={data.lesson.availableSpots} />
          </label>
        </div>
        <div>
          <label>
            Instructor: <input type="text" name="instructor" defaultValue={data.lesson.instructor} />
          </label>
        </div>
        <div>
          <label>
            Class Minutes: <input type="text" name="classMinutes" defaultValue={data.lesson.classMinutes} />
          </label>
        </div>
        <div>
          <label>
            Total Hours: <input type="text" name="totalHours" defaultValue={data.lesson.totalHours} />
          </label>
        </div>
        <div>
          <label>
            Lesson Cost: <input type="text" name="lessonCost" defaultValue={data.lesson.lessonCost} />
          </label>
        </div>
        <div>
          <button type="submit" className="bg-green-200">
            Update
          </button>
        </div>
      </form>
        <Link to={"/"}> Home </Link>
      </div>
    );
  }