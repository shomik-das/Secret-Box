import dbConnection from "@/lib/dbConnection";
import { NextResponse } from "next/server";
import User from "@/model/User";
import redis from "@/lib/redis";

export const GET = async (request: Request) => {
    try{
        await dbConnection();
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");
        if(!username){
            return NextResponse.json({
                success: false,
                message: "Username is required"
            }, {status: 400});
        }
        const cachedUser = await redis.get<string>(`user:${username}`);
        if (cachedUser) {
            try {
                const parsedUser = JSON.parse(cachedUser);
                return NextResponse.json({
                    success: true,
                    user: parsedUser,
            },{ status: 200 });
            } catch (err) {
                console.error("Invalid cached user JSON, clearing cache:", err);
                await redis.del(`user:${username}`);
            }
        }
        const user = await User.findOne({username});
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User does not exist"
            }, {status: 404});
        }
        await redis.set(`user:${username}`, JSON.stringify(user), {ex: 60*60*24} );
        return NextResponse.json({
            success: true,
            user
        }, {status: 200});
    }
    catch(err){
        console.log(err, "Error in getting user");
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, {status: 500});
    }
}