import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnection  from "@/lib/dbConnection";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { use } from "react";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "identifier", type: "text", placeholder: "Username or Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials, req): Promise<any> {
                if(!credentials?.identifier || !credentials?.password){
                    throw new Error("Please enter all the fields");
                }
                const {identifier, password} = credentials;
                await dbConnection();
                const user = await User.findOne({
                    $or: [
                        { username: credentials?.identifier },
                        { email: credentials?.identifier }
                    ]
                });
                if(!user){
                    throw new Error("No user found with the given username or email");
                }
                if(!user.isVerify){
                    throw new Error("User is not verified. Please sign up first");
                }
                if(password === "otp-bypass"){
                    if(!user.otpSession || !user.otpSessionExpiry || user.otpSessionExpiry < new Date()){
                        throw new Error("Please sign in with your password");
                    }
                    user.otpSession = false;
                    user.otpSessionExpiry = undefined;
                    await user.save();
                    return user;
                }
                    
                const isPasswordCorrect = await bcrypt.compare(credentials!.password, user.password);
                if(!isPasswordCorrect){
                    throw new Error("Please enter a valid password");
                }
                return user;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.email = user.email;
                token.isVerify = user.isVerify;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string;
                session.user.username = token.username as string;
                session.user.email = token.email as string;
                session.user.isVerify = token.isVerify as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
            }
            return session;
        }
    },
    pages:{
        signIn: '/auth',
    },
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // default it last for 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
}