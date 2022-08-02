import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import stylesUrl from "~/styles/global.css";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: stylesUrl }];
};


export default function AdminRoute() {
    return (
        <div className="container">
            <h1>ADMIN</h1>
            <Link to="../lessons"> View All Lessons </Link>
            <Link to="../lessons/new"> Add New Lesson </Link>
        </div>
    )
}