import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import Message from "@/model/Message";
import mongoose from "mongoose";
import redis from "@/lib/redis";


export async function POST(request: Request) {
    try{
        await dbConnection();
        const {username, content} = await request.json();
        const user = await User.findOne({username});
        if(!user){
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }), {status: 404});
        }
        //is user accepting the messages
        if(!user.isAcceptingMessages){
            return new Response(JSON.stringify({
                success: false,
                message: "User is not accepting messages"
            }), {status: 403});
        }
        const newMessage = await Message.create({
            content, createdAt: new Date()
        })
        user.messages.push(newMessage._id as mongoose.Types.ObjectId); // getting error here
        await user.save();
        //invalidate cache
        await redis.del(`messages:${user.username}`);
        return new Response(JSON.stringify({
            success: true,
            message: "Message sent successfully"
        }), {status: 200} );
    }
    catch(err){
        console.error("Error sending messages: ",err);
        return new Response(JSON.stringify({
            success: false,
            message: "Error sending messages"
        }), {status: 500});
    }

}