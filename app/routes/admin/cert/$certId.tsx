import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Certification } from "@prisma/client";
import { db } from "~/utils/db.server";
import CertIndexRoute from ".";

type LoaderData = { cert: Certification, certs: Array<Certification>, addPrereq: Boolean };


export const loader: LoaderFunction = async ({
  params
}) => {
  const cert = 
     await db.certification.findUnique({
      where: {id: params.certId},
      include: {requiredCerts: true, prereqFor: true}
  });

  const addPrereq = false  
  if (!cert) throw new Error("Lesson not found");
  const data: LoaderData = { cert, certs: await db.certification.findMany(), addPrereq };
  return json(data);
};

export const action: ActionFunction = async ({
  request,
}) => {

  const form = await request.formData();

  const inputType = form.get("input_type")
  const first = form.get("first");
  const second = form.get("second");


  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (
    typeof first !== "string" ||
    typeof second !== "string" 
  ) {
    throw new Error(`Form not submitted correctly.`);
  }

  switch(inputType){
    case "add_prereq": {
      console.log("add")
      await db.certification.update({data: {prereqFor: {connect: {id: first}}}, where: {id: second}}) 
      return null
    }
    case "remove_prereq": {
      console.log("here")
      await db.certification.update({data: {prereqFor: {disconnect: {id: first}}}, where: {id: second}})
      return null
    }
  }

  return null
};
//0a87a740-ab0e-42c9-aa92-64f627f21177

export default function LessonRoute() {
    const data = useLoaderData<LoaderData>();
    return (
      <div className="p-10">
        <div >
          <h2 className="text-lg">Selected: <span className="font-bold">{data.cert.name}</span></h2>
          <h2 className="text-lg">Description: {data.cert.description}</h2>
        </div>
        <div>
          Prerequisites:
          {data.cert.requiredCerts.map((cert) => (<li key={cert.id}><Link to={"/admin/cert/"+cert.id}>{cert.name} </Link>
          
            <form method="post">
                <div>
                  <input type="hidden" name="input_type" value="remove_prereq"/>
                  <input type="hidden" name="first" value={data.cert.id}/>
                  <input type="hidden" name="second" value={cert.id}/>
                </div>
                <button type="submit">remove</button>
            </form>
          </li>))}

        </div>
        <div>
          Needed For:
          {data.cert.prereqFor.map((cert) => (<li key={cert.id}><Link to={"/admin/cert/"+cert.id}>{cert.name} </Link></li>))}
        </div>
        <br></br>
        <div>
            <form method="post">
                <input type="hidden" name="input_type" value="add_prereq"/>
                <input type="hidden" name="first" value={data.cert.id}/>
                <div>
                    Pick a prerequisite:  
                    <select id="second" name="second">
                        {data.certs.map((c) => (<option key={c.id} value={c.id}> {c.name} </option>))}
                    </select>
                </div>
                <div>
                    <button type="submit" className="bg-blue-200 underline">add prereq</button>
                </div>
            </form>
        </div>
        
      </div>
    );
  }