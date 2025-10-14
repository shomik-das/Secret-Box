import dbConnection from "@/lib/dbConnection";
import { NextResponse } from "next/server";
import User from "@/model/User";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";


export const POST = async (req: Request) => {
    try{
        await dbConnection();
        const session = await getServerSession(options);
        const user = session?.user;
        if(!session || !user){
            return NextResponse.json({
                success: false,
                message: "User is not logged in"
            }, {status: 401})
        }
        const { id, name, username, headline, question, image } = await req.json()
        console.log("this is the id: ", id);
        if(!id || id !== user._id){
            return NextResponse.json({
                success: false,
                message: "User is not authorized"
            }, {status: 401})
        }
        const usernameOwner = await User.findOne({username});
        if(usernameOwner && user.username !== usernameOwner.username){
            if(usernameOwner.isVerify){
                return NextResponse.json({
                    success: false,
                    message: "Username already exists"
                }, {status: 400})
            }
        }
        const updatedUser = await User.findByIdAndUpdate(id, {
            name,
            username,
            headline,
            question,
            image
        }, {new: true})
        return NextResponse.json({
            success: true,
            message: "User details updated successfully",
            data: updatedUser
        }, {status: 200})
    }
    catch(err){
        console.error("Error updating user details", err);
        return NextResponse.json({
            success: false,
            message: "Error updating user details"
        }, {status: 500})
    }
}