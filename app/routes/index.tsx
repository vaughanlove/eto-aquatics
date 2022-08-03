import { Link } from "@remix-run/react";

export default function IndexRoute() {
    return (
        <div className="container">
          <div>             
            <Link to="lessons">See Lessons</Link>
          </div>
        </div>
      );
}