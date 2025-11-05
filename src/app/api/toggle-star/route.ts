
import dbConnection from "@/lib/dbConnection";
import Message from "@/model/Message";
import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import redis from "@/lib/redis";

export const POST= async (request: Request) => {
    try{
        const {id} = await request.json();
        if(!id){
            return NextResponse.json({
                success: false,
                message: "Message ID is required"
            }, {status: 400});
        }
        const session = await getServerSession(options);
        const user = session?.user;
        if(!session || !user){
            return NextResponse.json({
                success: false,
                message: "User not authenticated"
            }, {status: 401});
        }
        await dbConnection();
        const message = await Message.findById(id);
        if(!message){
            return NextResponse.json({
                success: false,
                message: "Message not found"
            }, {status: 404});
        }
        message.starred = !message.starred;
        await message.save();
        //invalidate cache
        await redis.del(`messages:${user.username}`);
        return NextResponse.json({
            success: true,
            message: "Star toggled successfully",
            starred: message.starred
        }, {status: 200});
    }
    catch(err){
        console.error("Error toggling star: ", err);
        return NextResponse.json({
            success: false,
            message: "Error toggling star"
        }, {status: 500});
    }
}