import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({
  request,
}) => {
  const form = await request.formData();
  const name = form.get("name");
  const description = form.get("description");
  const availableSpots = parseInt(form.get("availableSpots"));
  const instructor = form.get("instructor");
  const lowerAge = parseInt(form.get("lowerAge"));
  const upperAge = parseInt(form.get("upperAge"));
  const recurringDate = new Date(form.get("recurringDate"));
  const classMinuteDuration = parseInt(form.get("classMinuteDuration"));
  const totalDurationHours = parseInt(form.get("totalDurationHours"));
  const lessonCost = parseInt(form.get("lessonCost"));
  const prerequisite = form.get("prerequisite");



  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof availableSpots !== "number" ||
    typeof lowerAge !== "number" ||
    typeof upperAge !== "number" ||
    typeof classMinuteDuration !== "number" ||
    typeof totalDurationHours !== "number" ||
    typeof lessonCost !== "number" ||
    typeof prerequisite !== "string"
  ) {
    console.log()
    throw new Error(`Form not submitted correctly.`);
  }

  console.log("here")
  const fields = { name, description, availableSpots, instructor, lowerAge, upperAge, recurringDate, classMinuteDuration, totalDurationHours, lessonCost, prerequisite };
  console.log(fields)
  const lesson = await db.lesson.create({ data: fields });
  return redirect(`/lessons/${lesson.id}`);
};

export default function NewLessonRoute() {
  return (
    <div>
      <p>Make your lesson</p>
      <form method="post">
        <div>
          <label>
            Name: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Description: <textarea name="description" />
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
            Lower Age: <input type="number" name="lowerAge" step="1"/>
          </label>
        </div>
        to
        <div>
          <label>
            Upper Age: <input type="number" name="upperAge" step="1" /> 
          </label>
        </div>
        <div>
          <label>
            Lesson Date: <input type="datetime-local" name="recurringDate" />
          </label>
        </div>
        <div>
          <label>
            Class Minute Duration: <input type="number" name="classMinuteDuration" />
          </label>
        </div>
        <div>
          <label>
            Total Class Hours: <input type="number" name="totalDurationHours" />
          </label>
        </div>
        <div>
          <label>
            Cost: $<input type="number" name="lessonCost" />
          </label>
        </div>
        <div>
          <label>
            Prerequisites: <input type="text" name="prerequisite" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}