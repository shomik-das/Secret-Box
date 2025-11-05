import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnection  from "@/lib/dbConnection";
import User  from "@/model/User";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { rateLimit } from "@/lib/rateLimit";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "identifier", type: "text", placeholder: "Username or Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials, req): Promise<NextAuthUser | null>{
                if(!credentials?.identifier || !credentials?.password){
                    throw new Error("Please enter all the fields");
                    
                }
                const ip = req?.headers?.["x-forwarded-for"] || "unknown";
                const limitResult = await rateLimit(ip, 5, 60); // 5 attempts per minute
                if (!limitResult.success) {
                    throw new Error(limitResult.message);
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
                if (!user.password) {
                    throw new Error("You signed up with Google/GitHub. Please log in using that method or set a password first.");
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
            try{
                await dbConnection();
                if (account && account.provider !== "credentials") {
                    const existingUser = await User.findOne({ email: user.email });
                    if (existingUser) {
                        if (account.provider === "google" && !existingUser.googleId) {
                            existingUser.googleId = account.providerAccountId;
                            await existingUser.save();
                        }
                        else if (account.provider === "github" && !existingUser.githubId) {
                            existingUser.githubId = account.providerAccountId;
                            await existingUser.save();
                        }
                        user._id = existingUser._id.toString();
                        user.username = existingUser.username;
                        user.isVerify = existingUser.isVerify;
                        user.isAcceptingMessages = existingUser.isAcceptingMessages;
                        user.image = existingUser.image;
                        return true;
                    }
                    const baseUsername = user.name?.split(" ")[0]?.toLowerCase() || user.email?.split("@")[0];
                    let uniqueUsername;
                    let isUnique = false;
                    while (!isUnique) {
                        const randomNum = Math.floor(1000 + Math.random() * 9000);
                        uniqueUsername = `${baseUsername}${randomNum}`;
                        const existing = await User.findOne({ username: uniqueUsername });
                        if (!existing) isUnique = true;
                    }
                    const newUser = await User.create({
                        name: user.name,
                        username: uniqueUsername,
                        email: user.email,
                        isVerify: true,
                        image: user.image,
                        googleId: account.provider === "google" ? account.providerAccountId : null,
                        githubId: account.provider === "github" ? account.providerAccountId : null,
                    });
                    user._id = newUser._id.toString();
                    user.username = newUser.username;
                    user.isVerify = newUser.isVerify;
                    user.isAcceptingMessages = newUser.isAcceptingMessages;
                    user.image = newUser.image;
                    return true;
                }
                return true;
            }
            catch(err){
                console.error("Error: ", err);
                return false;
            }
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
        signIn: '/auth/signin-signup',
    },
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // default it last for 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    
}

