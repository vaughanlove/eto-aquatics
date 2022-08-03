import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import type { Certification } from "@prisma/client";

import { db } from "~/utils/db.server";

import { getUser } from "~/utils/session.server";

type LoaderData = {
   certs: Array<Certification>;
   user: Awaited<ReturnType<typeof getUser>>;
};


export const loader: LoaderFunction = async ({request}) => {
  const user = await getUser(request);

  const data: LoaderData = {
    certs: await db.certification.findMany(),
    user,
  };
  return json(data);
};

export default function LessonsRoute() {
    const data = useLoaderData<LoaderData>();
  return (
    <div >
        
      <header >
        <div className="container">
          <div >
            <Outlet />
          </div>
          <h1 className="home-link">
            <Link
              to="/"
              title="Eto Swim"
              aria-label="Eto Swim"
            >
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main>
        <div className="container">
          <div>
            <ul>
                {data.certs.map((cert) => (<li key={cert.id}><Link to={cert.id}>{cert.name} </Link></li>
                ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}