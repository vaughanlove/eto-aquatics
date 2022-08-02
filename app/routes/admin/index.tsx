import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import type { Certification } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = {
  certs: Array<Certification>
}

export const loader: LoaderFunction = async ({request}) => {
  const data: LoaderData = {
    certs: await db.certification.findMany(),
  };
  return json(data);
};

export default function AdminIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      {data.certs.map((cert) => (<div key={cert.id}><Link to={"cert/"+cert.id}>{cert.name} </Link></div>))}
    </div>
  );
}