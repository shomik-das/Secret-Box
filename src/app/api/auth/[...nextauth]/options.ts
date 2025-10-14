import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnection  from "@/lib/dbConnection";
import User  from "@/model/User";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "identifier", type: "text", placeholder: "Username or Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials): Promise<NextAuthUser | null>{
                if(!credentials?.identifier || !credentials?.password){
                    throw new Error("Please enter all the fields");
                    
                }
                const {identifier, password} = credentials;
                await dbConnection();
                const user  = await User.findOne({
                    $or: [
                        { username: identifier },
                        { email: identifier }
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
                    return {
                        _id: user._id.toString(),
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        isVerify: user.isVerify,
                        isAcceptingMessages: user.isAcceptingMessages,
                        image: user.image
                    } as  NextAuthUser;
                }
                    
                const isPasswordCorrect = await bcrypt.compare(credentials!.password, user.password);
                if(!isPasswordCorrect){
                    throw new Error("Please enter a valid password");
                }
                return {
                    _id: user._id.toString(),
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    isVerify: user.isVerify,
                    isAcceptingMessages: user.isAcceptingMessages,
                    image: user.image
                } as NextAuthUser;
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
        async signIn({ user, account }) {
            if (account?.provider !== "credentials") {
                await dbConnection();
                const existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    const baseUsername = user.name?.split(" ")[0]?.toLowerCase() || user?.email?.split("@")[0];
                    let uniqueUsername;
                    let isUnique = false;
                    while (!isUnique) {
                        const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digits
                        uniqueUsername = `${baseUsername}${randomNum}`;
                        const existing = await User.findOne({ username: uniqueUsername });
                        if (!existing) isUnique = true;
                    }
                    await User.create({
                        name: user.name,
                        username: uniqueUsername,
                        email: user.email,
                        isVerify: true,
                        image: user.image,
                        isAcceptingMessages: true,
                    });
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.user = user;
            }
            if (trigger === "update" && session?.user) {
                token.user = {
                    ...(token.user ?? {}),
                    ...session.user,
                };
            }
            // In session: { strategy: "jwt" } mode, there’s no database session store.
            // So the session object you get on the frontend is derived entirely from your JWT token via your session() callback.
            //      When you update the token → the session automatically updates next time it’s fetched.
            return token;
        },
        async session({ session, token }) {
            if (token && token.user) {
                session.user = token.user as import("next-auth").User;
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

