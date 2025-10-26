'use client';

import { AppBar } from "@/components/AppBar";
import Image from "next/image";
import { useSession } from "next-auth/react";


export default function Home() {
  
  const session = useSession();

    
  return (
    <>
    <AppBar/>


    <h1>{JSON.stringify(session)}</h1>
    </>
  );
}
