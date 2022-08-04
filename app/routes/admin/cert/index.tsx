import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import type { Certification, Lesson } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = {
    certs: Array<Certification>,
    lessons: Array<Lesson>,
}
  
export const loader: LoaderFunction = async ({request}) => {
const data: LoaderData = {
    certs: await db.certification.findMany(),
    lessons: await db.lesson.findMany({include: {award: true}}),
};
return json(data);
};
  

export default function CertIndexRoute() {
    const data = useLoaderData<LoaderData>();

    return (
      <div className="container">
        <h1 className="text-xl p-12">View/Add/Edit certifications</h1>
        <div className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl space-y-2">
          {data.certs.map((cert) => (<div className="rounded-md p-5 shadow-md bg-blue-200" key={cert.id}>{cert.name}<Link className="text-right" to={cert.id}> EDIT</Link></div>))} 
        </div>

      </div>
    );
  }