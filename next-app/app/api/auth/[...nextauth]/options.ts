import type { NextAuthOptions } from "next-auth";
import GitHubProdiver from 'next-auth/providers/github'
import CredentialsProvider  from "next-auth/providers/credentials";


export const options : NextAuthOptions = {

    providers:[
        GitHubProdiver({
            clientId: process.env.GITHUB_ID as string,
            clientSecret:process.env.GITHUB_SECRET as string,
        }),
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                username:{
                    label:"username",placeholder:"enter you username",type:"text"
                },
                password:{
                    label:"password",placeholder:"enter you password",type:"password"
                },
                role:{
                    label:"role",placeholder:"admin or player",type:"text"
                }

            },
            async authorize(credentials) {


                // This is wherer you need to retrieve user data to verify the credentials
                //validation

                const user = { id: "42", name: "Dave", password: "nextauth",role:"admin" }

                if (credentials?.username === user.name && credentials?.password === user.password && credentials?.role=== user.role) {
                    return user
                } else {
                    return null
                }
                
                
            }

        })
    ],

}