import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import mongoose from "mongoose";
import { ClientMessage } from "@/types/ClientMessage";
import redis from "@/lib/redis";
import { rateLimit } from "@/lib/rateLimit";
export interface IMessage {
    _id: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    read: boolean;
    starred: boolean;
}

export async function GET(request: Request) {
    try{
        await dbConnection();
        const ip = request.headers.get("x-forwarded-for") || "anonymous";
        const limitResult = await rateLimit(ip, 5, 60);
        if (!limitResult.success) {
            return new Response(
                JSON.stringify({
                success: false,
                message: limitResult.message,
            }),{ status: 429 });
        }
        const session = await getServerSession(options);
        const user = session?.user;
        if(!session || !user){
            return new Response(JSON.stringify({
                success: false,
                message: "User is not authenticated"
            }), {status: 401});
        }
        //check cache
        const cachedMessages = await redis.get<string>(`messages:${user.username}`);
        if(cachedMessages){
            return new Response(JSON.stringify({
                success: true,
                message: "Messages fetched successfully",
                data: JSON.parse(cachedMessages)
            }), {status: 200});
        }
        const userId = new mongoose.Types.ObjectId(user._id); //todo: why
        const userDB = await User.aggregate([  //todo: why aggregate need to study
            {
                $match: {
                    _id: userId
                }
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "messages",
                    foreignField: "_id",
                    as: "messages"
                }
            },
            { $unwind:{ path: "$messages", preserveNullAndEmptyArrays: true }},
            { $sort: { "messages.createdAt": -1 } },
            { $group: {
                _id: "$_id",
                messages: { $push: "$messages" }
            }}
        ]);

        if(!userDB || userDB.length === 0){
            return new Response(JSON.stringify({
                success: false,
                message: "No messages found"
            }), {status: 404});
        }

        const clientMessages = userDB[0].messages.map((msg: IMessage) => ({
            _id: msg._id.toString(),
            content: msg.content,
            createdAt: msg.createdAt.toISOString(),
            read: msg.read,
            starred: msg.starred
        })) as ClientMessage[]; //todo need to study this more
        //set cache
        await redis.set(`messages:${user.username}`, JSON.stringify(clientMessages), {ex: 60*5} ); //5 minutes
        return new Response(JSON.stringify({
            success: true,
            message: "Messages fetched successfully",
            data: clientMessages
        }), {status: 200});
    }
    catch(err){
        console.error("Error in get-messages route: ",err);
        return new Response(JSON.stringify({
            success: false,
            message: "Error getting messages"
        }), {status: 500});
    }
}