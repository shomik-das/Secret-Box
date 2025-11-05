import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import Message from "@/model/Message";
import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import redis from "@/lib/redis";

export const DELETE = async (request: Request) => {
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
        const userId = user._id;
        const messageDelete = await Message.findByIdAndDelete(id);
        const userUpdate = await User.findByIdAndUpdate(userId, {$pull: {messages: id}}, {new: true});

        if(!messageDelete || !userUpdate){
            return NextResponse.json({
                success: false,
                message: "Message or User not found"
            }, {status: 404});
        }
        //invalidate cache
        await redis.del(`messages:${user.username}`);
        return NextResponse.json({
            success: true,
            message: "Message deleted successfully"
        }, {status: 200});
    }
    catch(err){
        console.error("Error deleting message: ", err);
        return NextResponse.json({
            success: false,
            message: "Error deleting message"
        }, {status: 500});
    }
}