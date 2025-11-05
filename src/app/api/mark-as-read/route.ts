
import dbConnection from "@/lib/dbConnection";
import Message from "@/model/Message";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";


export const POST= async (request: Request) => {
    try{
        await dbConnection();
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
        const message = await Message.findById(id);
        if(!message){
            return NextResponse.json({
                success: false,
                message: "Message not found"
            }, {status: 404});
        }
        message.read = true;
        await message.save();
        //invalidate cache
        await redis.del(`messages:${user.username}`);
        return NextResponse.json({
            success: true,
            message: "Message marked as read"
        }, {status: 200});
    }
    catch(err){
        console.error("Error marking message as read: ", err);
        return NextResponse.json({
            success: false,
            message: "Error marking message as read"
        }, {status: 500});
    }
}