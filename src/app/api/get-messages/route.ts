import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import mongoose from "mongoose";


export async function POST(request: Request) {
    try{
        await dbConnection();
        const session = await getServerSession(options);
        const user = session?.user;
        if(!session || !user){
            return new Response(JSON.stringify({
                success: false,
                message: "Unauthorized"
            }), {status: 401});
        }
        const userId = new mongoose.Types.ObjectId(user._id);
        const userDB = await User.aggregate([
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
            { $unwind: "$messages" },
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
        return new Response(JSON.stringify({
            success: true,
            message: "Messages fetched successfully",
            messages: userDB[0].messages
        }), {status: 200});
    }
    catch(err){
        console.error("Error fetching messages: ",err);
        return new Response(JSON.stringify({
            success: false,
            message: "Error fetching messages"
        }), {status: 500});
    }
}