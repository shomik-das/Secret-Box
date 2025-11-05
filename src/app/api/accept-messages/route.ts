import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import redis from "@/lib/redis";


export async function POST(request: Request) {
    try{
        const session = await getServerSession(options); //todo: why we need to do this?
        const user = session?.user;
        if(!session || !user){
            return new Response(JSON.stringify({
                success: false,
                message: "User not authenticated"
            }), {status: 401});
        }
        const userId = user._id;
        const {acceptMessages} = await request.json();
        await dbConnection();
        const updatedUser = await User.findByIdAndUpdate(userId, {isAcceptingMessages: acceptMessages}, {new: true});
        if(!updatedUser){
            return new Response(JSON.stringify({
                success: false,
                message: "User does not exist"
            }), {status: 404});
        }
        await redis.set(`user:${user.username}`, JSON.stringify(updatedUser), {ex: 60*60*24} );
        return new Response(JSON.stringify({
            success: true,
            message: `You have ${acceptMessages ? "enabled" : "disabled"} accepting messages`,
            isAcceptingMessages: updatedUser.isAcceptingMessages
        }), {status: 200});
    }
    catch(err){
        console.error("Error updating user status: ",err);
        return new Response(JSON.stringify({
            success: false,
            message: "Error updating user status"
        }), {status: 500});
    }
}

export async function GET(request: Request) {
    try{
        const session = await getServerSession(options);
        const user = session?.user;
        if(!session || !user){
            return new Response(JSON.stringify({
                success: false,
                message: "User not authenticated"
            }), {status: 401});
        }
        const cachedUser = await redis.get<string>(`user:${user.username}`);
        if (cachedUser) {
            try {
                const parsedUser = JSON.parse(cachedUser);
                return new Response(JSON.stringify({
                    success: true,
                    isAcceptingMessages: parsedUser.isAcceptingMessages,
                }),{ status: 200 });
            } catch (err) {
                console.error("Invalid cached user JSON, clearing cache:", err);
                await redis.del(`user:${user.username}`);
            }
        }
        await dbConnection();
        const userId = user._id;
        const existingUser = await User.findById(userId);
        if(!existingUser){
            return new Response(JSON.stringify({ 
                success: false,
                message: "User does not exist"
            }), {status: 404});
        }
        await redis.set(`user:${user.username}`, JSON.stringify(existingUser), {ex: 60*60*24} );
        return new Response(JSON.stringify({
            success: true,
            isAcceptingMessages: existingUser.isAcceptingMessages
        }), {status: 200});
    }
    catch(err){
        console.error("Error getting user status: ",err);
        return new Response(JSON.stringify({
            success: false,
            message: "Error getting user status"
        }), {status: 500});
    }
}