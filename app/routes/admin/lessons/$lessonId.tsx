
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
        award: true,
        times: true,
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
  const input_type = form.get("input_type");
  const availableSpots = parseInt(form.get("availableSpots"));
  const instructor = form.get("instructor");
  const start = new Date(form.get("start"));
  const end = new Date(form.get("end"));
  const classMinutes = parseInt(form.get("classMinutes"));
  const totalHours = parseInt(form.get("totalHours"));
  const lessonCost = parseInt(form.get("lessonCost"));
  const lessonId = form.get("lessonId");
  const timeslotId = form.get("timeslotId");
  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  // if (
  //   typeof availableSpots !== "number" ||
  //   typeof classMinutes !== "number" ||
  //   typeof totalHours !== "number" ||
  //   typeof lessonId !== "string"
  // ) {
  //   console.log()
  //   throw new Error(`Form not submitted correctly.`);
  // }

  switch(input_type){
    case "createLesson": {
      let lesson = await db.lesson.update({data: {availableSpots: availableSpots, instructor: instructor, classMinutes: classMinutes,totalHours: totalHours, lessonCost: lessonCost}, where: {id: lessonId}, select: {id: true}})
      return redirect(`/admin/lessons/${lesson.id}`);
    }
    case "removeLesson": {
      await db.timeslot.delete({where: {id: timeslotId}})
      return null
    }
    case "addLessonTime": {
      await db.timeslot.create({data: {start: start.toISOString(), end: end.toISOString(), for: {connect: {id: lessonId}}}})
      return null
    }
  }

};

export default function LessonRoute() {
    const data = useLoaderData<LoaderData>();
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })
    }
    return (
      <div className="container  mx-auto">
        <h1 className="text-2xl"> Editing Lesson {data.lesson.id}</h1>
        <div className="container flex">
          <form method="post" className="">
            <input type="hidden" name="input_type" value="createLesson"/>

            <div>
              <label>
              <input type="hidden" name="lessonId" defaultValue={data.lesson.id} />
              </label>
            </div>
            <div className="px-4 py-3">
              Available Spots: 
              <div>
                <label>
                  <input className="
                      mt-0
                      block
                      px-0.5
                      border-0 border-b-2 border-gray-200
                      focus:ring-0 focus:border-black
                    " type="text" name="availableSpots" defaultValue={data.lesson.availableSpots} />
                </label>
              </div>
            </div>
            <div className="px-4 py-3">
              Instructor: 
              <div>
                <label>
                  <input className="
                      mt-0
                      block
                      px-0.5
                      border-0 border-b-2 border-gray-200
                      focus:ring-0 focus:border-black" type="text" name="instructor" defaultValue={data.lesson.instructor} />
                </label>
              </div>
            </div>
            <div className="px-4 py-3">
            Class Minutes: 
              <div>
                <label>
                  <input className="
                      mt-0
                      block
                      px-0.5
                      border-0 border-b-2 border-gray-200
                      focus:ring-0 focus:border-black
                    " type="text" name="classMinutes" defaultValue={data.lesson.classMinutes} />
                </label>
              </div>
            </div>
            <div className="px-4 py-3">
              Total Hours: 
              <div>
                <label>
                  <input className="
                      mt-0
                      block
                      px-0.5
                      border-0 border-b-2 border-gray-200
                      focus:ring-0 focus:border-black
                    " type="text" name="totalHours" defaultValue={data.lesson.totalHours} />
                </label>
              </div>
            </div>
            <div className="px-4 py-3">
              Lesson Cost ($): 
              <div>
                <label>
                  <input className="
                      mt-0
                      block
                      px-0.5
                      border-0 border-b-2 border-gray-200
                      focus:ring-0 focus:border-black
                    " type="text" name="lessonCost" defaultValue={data.lesson.lessonCost} />
                </label>
              </div>
            </div>
            <div className="px-4 py-3">
              <button type="submit" className="text-sm font-medium bg-green-200 px-6 py-2 rounded-full">
                Update
              </button>
            </div>
          </form>
          
          <div className="p-4">
            <h1 className="text-xl">Times</h1>
            {data.lesson.times.map((timeslot) => 
            (<div  className="container flex p-2 items-center" key={timeslot.id}>{formatDate(timeslot.start)} - {formatDate(timeslot.end)} 
              <form method="post">
                <input type="hidden" name="input_type" value="removeLesson"/>
                <input type="hidden" name="timeslotId" value={timeslot.id}/>
                <button className="rounded bg-red-300 py-1 px-3 mx-12" type="submit">
                  X
                </button>
              </form>
            </div>))}
            <form method="post" className="container items-center mx-auto">
              <input type="hidden" name="lessonId" defaultValue={data.lesson.id} />
              <input type="hidden" name="input_type" value="addLessonTime"/>
              <input className="
                    mt-1
                    block
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  " type="datetime-local" name="start" />
              <input className="
                    mt-1
                    block
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  " type="datetime-local" name="end"/>
              <button className="text-sm font-medium bg-green-200 px-6 py-2 my-2 rounded-full" type="submit">
                Add Time
              </button>
            </form>
          </div>
          <div>
            <h1 className="text-xl">Invoices (todo)</h1>
          </div>
        </div>
      </div>
    );
  }