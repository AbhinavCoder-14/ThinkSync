import type { NextAuthOptions, DefaultSession } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { generateKey } from "crypto";

import { JWT } from "next-auth/jwt";

import prisma from "@/app/lib/db";

import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto'

declare module "next-auth" {
  interface Session extends DefaultSession {
    id?: string;
    user: DefaultSession["user"] & {
      role?: string | null;
    };
  }
  interface User {
    id?: string;
    role?: string | null;
  }
}



interface user {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface token extends JWT {
  uid: string;
  jwtToken: string;
}



async function generateJWT(id:any) {
    return null
}

async function validationUser(
  email: string,
  password: string
): Promise<
  | { data: null }
  | {
      data: {
        name: string;
        userid: string;
        token: string;
      };
    }
> {


    if (process.env.LOCAL_DEVELOPMENT){
        if(password === '1234'){
            return {
                data:{
                    name:"Abhinav",
                    userid:"1",
                    token:"",
                }
            }
        }
    }

    // api call of another db to check the user is exist or not 


    // this is the way for the sass company to check there user in the global parent company database if they are not in the particular db




    return {data:null};

}

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          placeholder: "enter you username",
          type: "text",
        },
        password: {
          label: "password",
          placeholder: "enter you password",
          type: "password",
        },
        role: {
          label: "role",
          placeholder: "admin or player",
          type: "text",
        },
      },
      async authorize(credentials:any) {
        // This is wherer you need to retrieve user data to verify the credentials
        //validation

        try{
            if (process.env.LOCAL_DEVELOPMENT){

                if (credentials.username === "abhinav" && credentials.password === "1234"){
                    return{
                        id:"1",
                        name:"Abhinav",
                        email:"test@gmail.com",
                        role:"Admin",
                        token: await generateJWT({
                            id:"1"
                        }),
                    };
                }
                else return null
                
            }

            const hashPassword = await bcrypt.hash(credentials.password,10);

            const userDb = await prisma.user.findFirst({
              where:{
                name:credentials.username,
              },

              select:{
                password:true,
                id:true,
                name:true,
                role:true
              }
            });
            
            if (userDb && userDb.password && (await bcrypt.compare(credentials.password,userDb.password))){

              const jwt = await generateJWT({
                id:userDb.id
              });

              await prisma.user.update({
                where:{
                  id:userDb.id,
                },

                data:{
                  token:jwt,
                }
              });
              return{
                id:userDb.id,
                name:userDb.name,
                email:userDb.email,
                token:jwt,
              }
            }

            console.log("not in db")



            const newUser = await prisma.user.create({
              data:{
                name:credentials.username,
                password:hashPassword,
                role:credentials.role
              }
            })



            const jwt = await generateJWT({
              id:newUser.id

            })


            return {
                id: newUser.id,
                name: newUser.username,
                email: newUser.email,
                role: newUser.role,
                token: jwt
            };

            
            
        }catch(e:any){
          console.log(e)
          return null
        }






        const user = {
          id: "42",
          name: "Dave",
          password: "nextauth",
          role: "admin",
        };

        if (
          credentials?.username === user.name &&
          credentials?.password === user.password &&
          credentials?.role === user.role
        ) {
          return {
            id: user.id,
            name: user.name,
            role: user.role,
            email: `${user.name}@quiz.com`,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.email = user.email;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
};
