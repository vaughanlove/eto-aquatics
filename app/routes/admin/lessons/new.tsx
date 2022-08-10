import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Certification } from "@prisma/client";


import { db } from "~/utils/db.server";
import { requireUserAdmin } from "~/utils/session.server";

type LoaderData = {
  isAdmin: Awaited<ReturnType<typeof requireUserAdmin>>;
  certs: Array<Certification>;
}

export const loader: LoaderFunction  = async ({request}) => {
  const isAdmin = await requireUserAdmin(request);
  const data: LoaderData = {
    isAdmin,
    certs: await db.certification.findMany()
  }
  return json(data);
}

export const action: ActionFunction = async ({
  request,
}) => {

  const form = await request.formData();
  const certificationId = form.get("certId");
  const availableSpots = parseInt(form.get("availableSpots"));
  const instructor = form.get("instructor");
  const classMinutes = parseInt(form.get("classMinutes"));
  const totalHours = parseInt(form.get("totalHours"));
  const lessonCost = parseInt(form.get("lessonCost"));

  console.log(classMinutes)
  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (
    typeof availableSpots !== "number" ||
    typeof classMinutes !== "number" ||
    typeof totalHours !== "number" ||
    typeof lessonCost !== "number"
  ) {
    throw new Error(`Form not submitted correctly.`);
  }

  const fields = {availableSpots, instructor, classMinutes, totalHours, lessonCost, certificationId };
  const lesson = await db.lesson.create({ data: fields });
  return redirect(`${lesson.id}`);
};

export default function NewLessonRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto p-12">
      {data.isAdmin ?
      (
      <div>
        <h1 className="text-xl"> Create a New Lesson</h1>
        <form method="post" className="container flex items-center space-x-6">
          <div className="">
            Pick Award:
            <select name="certId" className="rounded">
                {data.certs.map((c) => (<option key={c.id} value={c.id}> {c.name} </option>))}
              </select>
          </div>
          <div>
            <label>
              Available Spots: <input className="rounded" type="number" name="availableSpots" />
            </label>
          </div>
          <div>
            <label>
              (Optional) Instructor: <input className="rounded" type="text" name="instructor" />
            </label>
          </div>
          <div>
            <label>
              Class Minute Duration: <input className="rounded" type="number" name="classMinutes" />
            </label>
          </div>
          <div>
            <label>
              Total Class Hours: <input className="rounded" type="number" name="totalHours" />
            </label>
          </div>
          <div>
            <label>
              Cost: $<input className="rounded" type="number" name="lessonCost" />
            </label>
          </div>
          <div className="mt-4">
            <button type="submit" className="border bg-blue-300 py-1 px-2 rounded-full">
              Create
            </button>
          </div>
        </form> 
      </div>
      ) : (<Link to="/login">Login</Link>)
    }
    </div>
  );
}