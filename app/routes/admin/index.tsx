import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import type { Lesson, User } from "@prisma/client";

import { db } from "~/utils/db.server";
type LoaderData = {
  lessons: Array<Lesson>,
}

export const loader: LoaderFunction = async ({request}) => {
  const data: LoaderData = {
      lessons: await db.lesson.findMany({select: {id: true, availableSpots: true, award: true, times: true, swimmers: {select: {user: {select: {username: true}}}}}}),
  };

  console.log(data.lessons[0])

  return json(data);
  };

export default function AdminIndexRoute() {
  const data = useLoaderData<LoaderData>();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })
  }
  return (
    <div className="container mx-auto px-4">
      <div className="text-center">
        <h1 className="text-xl font-medium ">Admin Dashboard</h1>
      </div>
      <div className="container text-center space-x-12">
        <Link className="text-md text-blue-500" to="/admin/cert"> Edit Certifications</Link>
        <Link className="text-md text-green-500" to="/admin/lessons/new"> Create New Lesson </Link> 
      </div>
      <h1 className="text-xl py-6"> Current Lessons: </h1>
      <div className="container flex space-x-8">
          {data.lessons.map((lesson) => 
          (
          <div className="rounded-lg basis-1/4 text-left shadow-sm bg-blue-100 p-4" key={lesson.id}>
            <p className="text-lg font-medium text-center">
              {lesson.award.name} Lesson
            </p>
            <div>
              {lesson.availableSpots - lesson.swimmers.length} spots available
            </div>
            <div>
              {lesson.times[0] ? (<div> Next Timeslot: {formatDate(lesson.times[0].start)}</div>) : (<div>No dates scheduled for lesson</div>)}
            </div>
            <div>
              {lesson.swimmers[0] ? (<div> {lesson.swimmers.length} Swimmers Enrolled: <br></br>{lesson.swimmers[0].user.username}</div>) : (<div>No one enrolled</div>)}
            </div>
            <Link className="text-right text-sm text-red-500" to={"lessons/"+lesson.id}> 
              EDIT
            </Link>
          </div>
          ))} 
      </div>
    </div>
  );
}