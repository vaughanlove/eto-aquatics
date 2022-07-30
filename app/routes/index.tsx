import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import stylesUrl from "~/styles/global.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};
export default function IndexRoute() {
    return (
        <div className="container">
          <div className="content">
            <h1>
              <span>Eto Swim Academy!</span>
            </h1>              
            <Link to="lessons">See Lessons</Link>
          </div>
        </div>
      );
}