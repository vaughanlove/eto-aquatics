import { Link, Links, LiveReload, Outlet } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./styles/app.css"

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }]
}

export default function App() {
  return (
    <html lang="en" className="">
      <head>
        <Links />
        <meta charSet="utf-8" />
        <title>Eto Swim Academy</title>
      </head>
      <div className="container text-center p-12 mx-auto">
        <Link className="font-medium text-3xl" to={"/"}> Eto Swim Academy </Link>
        <div className="container shadow-sm space-x-8 p-6">
          <Link to="team" className="text-md text-black"> Our Team </Link>
          <Link to="lessons" className="text-md  text-black"> Lessons </Link>
          <Link to="admin" className="text-md text-black"> Admin </Link>
        </div>
      </div>

      <body className="">
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}