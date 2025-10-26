import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
 



const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name:"Email",
            credentials: {
                username : {label:"username",placeholder:"email",type:"text"},
                password : {label:"password",placeholder:"password",type:"password"},
                role:{label:'role',placeholder:'',type:"text"}
            },
            
            async authorize(credentials:any) {
                const {username, password, role} = credentials
                console.log(credentials)


                // validation
                // return null if you can't find the user, NextAuth auto understand and throw error
                return{
                    id:"1",
                    username:"xyz",
                    password:"pass",
                    role:'hello'
                }
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET
})



export const GET = handler;
export const POST = handler;

