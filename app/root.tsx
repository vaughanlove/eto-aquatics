import { Links, LiveReload, Outlet } from "@remix-run/react";
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
      <body>
        <h1 className="text-3xl font-bold underline">
          Eto Swim Academy
        </h1>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}