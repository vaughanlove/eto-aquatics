import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import type { Lesson } from "@prisma/client";

import { db } from "~/utils/db.server";
type LoaderData = {
  lessons: Array<Lesson>,
}

export const loader: LoaderFunction = async ({request}) => {
  const data: LoaderData = {
      lessons: await db.lesson.findMany({include: {award: true, times: true}}),
  };
  return json(data);
  };

export default function AdminIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="container">
      <div>
        <h1 className="text-xl font-medium p-12">Admin Dashboard</h1>
        <Link className="text-l p-12 text-red-500" to="/admin/cert"> Edit Certifications</Link>
      </div>
      <h1 className="text-xl p-12">Current Lessons</h1>
        <div className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl space-y-2">
          {data.lessons.map((lesson) => (<div className="rounded-md p-5 shadow-md bg-blue-200" key={lesson.id}>{lesson.award.name}<br></br> Times {lesson.times.map((timeslot)=> (<p key={timeslot.id}>{timeslot.start}</p>))}<Link className="text-right" to={"lessons/"+lesson.id}> EDIT</Link></div>))} 
        </div>   
    </div>
  );
}