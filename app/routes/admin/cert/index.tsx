import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import type { Certification } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = {
    certs: Array<Certification>
}
  
export const loader: LoaderFunction = async ({request}) => {
const data: LoaderData = {
    certs: await db.certification.findMany(),
};
return json(data);
};

export const action: ActionFunction = async ({
    request,
  }) => {
  
    const form = await request.formData();
    const first = form.get("first");
    const second = form.get("second");
    console.log("here")
    // we do this type check to be extra sure and to make TypeScript happy
    // we'll explore validation next!
    if (
      typeof first !== "string" ||
      typeof second !== "string" 
    ) {
      throw new Error(`Form not submitted correctly.`);
    }
  
    const fields = { first, second};
    await db.prerequisite.create({ data: fields });
    console.log("success!")

  };
  

export default function CertIndexRoute() {
    const data = useLoaderData<LoaderData>();

    return (
      <div className="container">
        <h1>View/Add/Edit certifications</h1>
        {data.certs.map((cert) => (<div key={cert.id}><Link to={"cert/"+cert.id}>{cert.name} </Link>|| {cert.id}</div>))} 
        <div>
            <form method="post">
                <div>
                    <label>
                        Name: <input type="text" placeholder="first class" name="first"/>
                    </label>
                </div>
                <div>
                    <label>
                        Description: <input type="text" placeholder="second class" name="second" />
                    </label>
                </div>
                <div>
                    <button type="submit">add prereq</button>
                </div>
            </form>
        </div>

      </div>
    );
  }