import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export const POST = async (request: Request) => {
    try{
        await dbConnection();
        const {username, newPassword} = await request.json();

        const user = await User.findOne({username});
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, {status: 404});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return NextResponse.json({
            success: true,
            message: "Password reset successful"
        }, {status: 200});
    }
    catch(err){
        console.error("Error in reset-password route: ", err);
        return NextResponse.json({
            success: false,
            message: "Error resetting password"
        }, {status: 500});
    }
}