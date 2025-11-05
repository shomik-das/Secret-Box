import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export const POST = async (request: Request) => {
    try{
        const {username, newPassword, token} = await request.json();
        if(!username || !newPassword || !token){
            return NextResponse.json({
                success: false,
                message: "Username, new password and token are required"
            }, {status: 400});
        }
        await dbConnection();
        const user = await User.findOne({username});
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User does not exist",
            }, {status: 404});
        }
        if(user.resetToken !== token){
            return NextResponse.json({
                success: false,
                message: "Reset password link invalid"
            }, {status: 400});
        }
        if(user.resetTokenExpiry! < new Date()){
            return NextResponse.json({
                success: false,
                message: "Reset password link has expired"
            }, {status: 400});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
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