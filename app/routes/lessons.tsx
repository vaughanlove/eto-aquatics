import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import type { Lesson } from "@prisma/client";

import { db } from "~/utils/db.server";


import stylesUrl from "~/styles/global.css";

type LoaderData = { lessons: Array<Lesson> };


export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader: LoaderFunction = async () => {
    const data: LoaderData = {
      lessons: await db.lesson.findMany(),
    };
    return json(data);
  };

export default function JokesRoute() {
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
        </div>
      </header>
      <main>
        <div className="container">
          <div>
            <ul>
                {data.lessons.map((lesson) => (<li key={lesson.id}><Link to={lesson.id}>{lesson.name} </Link></li>
                ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}