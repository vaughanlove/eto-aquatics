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
      lessons: await db.lesson.findMany({include: {award: true, times: true, swimmers: true}}),
  };
  return json(data);
  };

export default function AdminIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto px-4">
      <div className="text-center">
        <h1 className="text-xl font-medium ">Admin Dashboard</h1>
      </div>
      <div className="container text-center space-x-12">
        <Link className="text-md text-blue-500" to="/admin/cert"> Edit Certifications</Link>
        <Link className="text-md text-green-500" to="/admin/lessons/new"> Create New Lesson </Link> 
      </div>
      <h1 className="text-xl"> Current Lessons: </h1>
      <div className="container flex space-x-8">
          {data.lessons.map((lesson) => (<div className="rounded-lg basis-1/4 text-center shadow-sm bg-green-100" key={lesson.id}>{lesson.award.name} Lesson<br></br><Link className="text-right" to={"lessons/"+lesson.id}> EDIT</Link>{lesson.times[0] ? (<div> Next start: {lesson.times[0].start}</div>) : (<div></div>)}</div>))} 
      </div>
    </div>
  );
}