import { AppBar } from "@/components/AppBar";
import Image from "next/image";

import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";


export default async function Home() {
  
  const session = await getServerSession(options);

    
  return (
    <>
    <AppBar/>


    <h1>{JSON.stringify(session)}</h1>
    </>
  );
}
