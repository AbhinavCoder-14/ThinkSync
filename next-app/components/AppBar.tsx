"use client";
import { useRouter } from "next/navigation"

import { signIn,signOut,useSession } from "next-auth/react"



export const AppBar = () =>{
    const router = useRouter();
    const session = useSession();

    return(
        <div>
            <button  className="m-3 p-2 border-blue-900 border-2 cursor-pointer rounded-xl" onClick={()=>{
                signIn();
            }}>Organise a Quiz</button>

            <button className="m-3 p-2 border-blue-900 border-2 cursor-pointer rounded-xl" onClick={()=>{
            signOut(); 3
            }}>Logout</button>

            {JSON.stringify(session.data?.user)}
        </div>
    )
}