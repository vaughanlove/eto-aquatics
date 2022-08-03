import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Certification } from "@prisma/client";
import { db } from "~/utils/db.server";

type LoaderData = { cert: Certification };

export const loader: LoaderFunction = async ({
  params
}) => {
  const cert = 
     await db.certification.findUnique({
      where: {id: params.certId},
  });
  if (!cert) throw new Error("Lesson not found");
  const data: LoaderData = { cert };
  return json(data);
};

export default function LessonRoute() {
    const data = useLoaderData<LoaderData>();
    return (
      <div>
        <h2>Selected: {data.cert.name}</h2>
        <h3>{data.cert.description}</h3>
        <Link to={"/"}> Home </Link>
      </div>
    );
  }