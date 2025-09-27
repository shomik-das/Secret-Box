
import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import sendEmail from "@/helper/sendOtpEmail";
import { NextResponse } from "next/server";
import { ca } from "zod/v4/locales";

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

    }
    catch(err){
        console.error("Error deleting message: ", err);
        return NextResponse.json({
            success: false,
            message: "Error deleting message"
        }, {status: 500});
    }
}