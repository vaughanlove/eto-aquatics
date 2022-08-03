import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";


import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({
  request,
}) => {

  const form = await request.formData();
  const name = form.get("name");
  const description = form.get("description");

  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (
    typeof name !== "string" ||
    typeof description !== "string"
  ) {
    console.log()
    throw new Error(`Form not submitted correctly.`);
  }

  const fields = { name, description, prerequisite: {
    create: [{}]
  } };
  const cert = await db.certification.create({ data: fields });
  return redirect(`/admin/cert/${cert.id}`);
};

export default function NewLessonRoute() {

  return (
    <div>       
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
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}