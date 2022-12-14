import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";


import { db } from "~/utils/db.server";
import { requireUserAdmin } from "~/utils/session.server";

type LoaderData = {
  isAdmin: Awaited<ReturnType<typeof requireUserAdmin>>;
}

export const loader: LoaderFunction  = async ({request}) => {
  const isAdmin = await requireUserAdmin(request);
  const data: LoaderData = {
    isAdmin
  }
  return json(data);
}

export const action: ActionFunction = async ({
  request,
}) => {

  const form = await request.formData();
  const availableSpots = parseInt(form.get("availableSpots"));
  const instructor = form.get("instructor");
  const classMinutes = parseInt(form.get("classMinuteDuration"));
  const totalHours = parseInt(form.get("totalDurationHours"));
  const lessonCost = parseInt(form.get("lessonCost"));

  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (
    typeof availableSpots !== "number" ||
    typeof classMinutes !== "number" ||
    typeof totalHours !== "number" ||
    typeof lessonCost !== "number"
  ) {
    console.log()
    throw new Error(`Form not submitted correctly.`);
  }

  const fields = {availableSpots, instructor, classMinutes, totalHours, lessonCost };
  const lesson = await db.lesson.create({ data: fields });
  return redirect(`admin/lessons/${lesson.id}`);
};

export default function NewLessonRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="container p-12">
      {data.isAdmin ?
      (
      <form method="post">
        <div>
          <label>
            Award: <input type="text" name="award" />
          </label>
        </div>
        <div>
          <label>
            Available Spots: <input type="number" name="availableSpots" />
          </label>
        </div>
        <div>
          <label>
            (Optional) Instructor: <input type="text" name="instructor" />
          </label>
        </div>
        <div>
          <label>
            Class Minute Duration: <input type="number" name="classMinutes" />
          </label>
        </div>
        <div>
          <label>
            Total Class Hours: <input type="number" name="totalHours" />
          </label>
        </div>
        <div>
          <label>
            Cost: $<input type="number" name="lessonCost" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Create
          </button>
        </div>
      </form> ) : (
            <Link to="/login">Login</Link>
          )
    }
    </div>
  );
}