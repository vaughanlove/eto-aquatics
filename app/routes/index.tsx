import { Link } from "@remix-run/react";

export default function IndexRoute() {
    return (
        <div className="container">
          <div>
            <h1>
              <span>Eto Swim Academy!</span>
            </h1>              
            <Link to="lessons">See Lessons</Link>
          </div>
        </div>
      );
}