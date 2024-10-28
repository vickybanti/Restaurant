import NextAuth, { getServerSession, NextAuthOptions, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook";
import { prisma } from "./connect"
import { PrismaAdapter } from "@auth/prisma-adapter"

declare module "next-auth"{
  interface Session{
    user:User & {
      isAdmin:Boolean;
    }
  }
}

declare module "next-auth/jwt"{
  interface JWT{
    
      isAdmin:Boolean;
    
  }
}

export const authOptions:NextAuthOptions = {
    // Configure one or more authentication providers
    adapter: PrismaAdapter(prisma),
    session:{
    strategy:"jwt"
},
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
        httpOptions: {
          timeout: 10000, // 10 seconds
        },
      
      
      }),

      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        httpOptions: {
          timeout: 10000, // 10 seconds
        },
      })
      
      // ...add more providers here
    ],
    callbacks:{
      async session({token, session}) {
        if(token){
          session.user.isAdmin = token.isAdmin
        }
        return session
      },
      async jwt({token}) {
        const userInDb = await prisma.user.findUnique({
          where:{
            email:token.email!
          }
        })
        token.isAdmin=userInDb?.isAdmin!
        return token
       
        }
      }
    }
  
  export const getAuthSession = () => getServerSession(authOptions)
