import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import  dbConnection  from "@/lib/dbConnection";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username or Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials, req): Promise<any> {
                if(!credentials?.username || !credentials?.password){
                    throw new Error("No credentials provided");
                }
                try{
                    await dbConnection();
                    const user = await User.findOne({
                        $or: [
                            { username: credentials?.username },
                            { email: credentials?.username }
                        ]
                    });
                    if(!user){
                        throw new Error("No user found with the given username or email");
                    }
                    if(user.isVerify){
                        throw new Error("Please verify your email to login");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials!.password, user.password);
                    if(!isPasswordCorrect){
                        throw new Error("Incorrect password");
                    }
                    return user;
                }
                catch(err){
                    console.log(err);
                }
            }
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
                session.user._id = token.id as string;
                session.user.username = token.username as string;
                session.user.email = token.email as string;
                session.user.isVerify = token.isVerify as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
            }
            return session;
        }
    },
    pages:{
        signIn: '/signin',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.JWT_SECRET,
}