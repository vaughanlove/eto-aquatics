import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import type { Lesson } from "@prisma/client";

import { db } from "~/utils/db.server";

import { getUser } from "~/utils/session.server";
import stylesUrl from "~/styles/global.css";

type LoaderData = {
   lessons: Array<Lesson>;
   user: Awaited<ReturnType<typeof getUser>>;
};


export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader: LoaderFunction = async ({request}) => {
  const user = await getUser(request);

  const data: LoaderData = {
      lessons: await db.lesson.findMany(),
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
                {data.lessons.map((lesson) => (<li key={lesson.id}><Link to={lesson.id}>{lesson.name} </Link></li>
                ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}