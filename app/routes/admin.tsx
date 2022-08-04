import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import type { Certification } from "@prisma/client";

import { db } from "~/utils/db.server";
import { requireUserAdmin } from "~/utils/session.server";

type LoaderData = {
    isAdmin: Awaited<ReturnType<typeof requireUserAdmin>>;
}

export const loader: LoaderFunction = async ({request}) => {
    const isAdmin = await requireUserAdmin(request);

const data: LoaderData = {
    isAdmin,
};
return json(data);
};

export default function AdminRoute() {
    const data = useLoaderData<LoaderData>();
    return (
        <div>
            {data.isAdmin ? 
            (
            <div className="bg-red">
                <Outlet />
            </div>
            ) : (<Link to="/login">Login</Link>)} 
        </div>
    )
}