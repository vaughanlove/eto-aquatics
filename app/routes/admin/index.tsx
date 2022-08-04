import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import type { Certification } from "@prisma/client";

import { db } from "~/utils/db.server";

export default function AdminIndexRoute() {

  return (
    <div className="container">
      <h1 className="text-xl font-medium p-12">Admin Dashboard</h1>
      <Link className="text-l p-12 text-red-500" to="/admin/cert"> Edit Certifications</Link>
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
      </div>     
    </div>
  );
}