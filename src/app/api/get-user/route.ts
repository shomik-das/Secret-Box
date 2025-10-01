import dbConnection from "@/lib/dbConnection";
import Message from "@/model/Message";
import { NextResponse } from "next/server";
import User from "@/model/User";

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
        const user = await User.findOne({username});
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User does not exist"
            }, {status: 404});
        }
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