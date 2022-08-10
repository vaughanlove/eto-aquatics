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
      <div className="container mx-auto">
        <h1 className="text-xl p-12">View/Add/Edit certifications</h1>
        <div className="grid grid-flow-row-dense grid-cols-7">
          {data.certs.map((cert) => (<Link className="text-center hover:bg-pink-500 hover:rounded-xl" to={cert.id}> <div className="rounded-md p-5 m-2 shadow-md bg-blue-200" key={cert.id}>{cert.name}</div></Link>))} 
        </div>
      </div>
    );
  }