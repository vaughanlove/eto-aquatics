import { Link, Links, LiveReload, Outlet } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./styles/app.css"

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Links />
        <meta charSet="utf-8" />
        <title>Eto Swim Academy</title>
      </head>
      <div className="p-6 max-w mx-auto bg-white shadow-md flex items-center space-x-4">
        <div>
          <div className="text-xl font-medium text-black"> <Link to={"/"}> Eto Swim Academy </Link></div>
        </div>
      </div>
      <div className="m-6 p-6 max-w mx-auto bg-white shadow-md flex items-center space-x-4">
        <div>
          <Link to="team" className="text-md font-medium text-black"> Our Team </Link>
        </div>
        <div>
          <Link to="lessons" className="text-md font-medium text-black"> Lessons </Link>
        </div>
        <div>
          <Link to="admin" className="text-md font-medium text-black"> Admin </Link>
        </div>
      </div>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}