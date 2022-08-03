import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import type { Certification } from "@prisma/client";

import { db } from "~/utils/db.server";

export default function AdminIndexRoute() {

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
        <Link to="/admin/cert" className="text-xl underline"> Certifications </Link>
      </div>     
    </div>
  );
}