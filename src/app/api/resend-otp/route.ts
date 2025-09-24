import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import sendEmail from "@/helper/sendOtpEmail";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
    try{
        await dbConnection();
        const {username} = await request.json();
        const user = await User.findOne({username});
        if(!user){
            return NextResponse.json({
                success: false,
                message: 'User not found',
            }, {status: 404} );
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyCodeExpiry = new Date();
        verifyCodeExpiry.setMinutes(verifyCodeExpiry.getMinutes() + 10);
        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = verifyCodeExpiry;
        await user.save();
        const emailResponse = await sendEmail(user.email, user.username, verifyCode);
        if(!emailResponse.success){
            return NextResponse.json({
                success: false,
                message: 'Error resending verification email',
            }, {status: 500} );
        }
        return NextResponse.json({
            success: true,
            message: 'Verification email resent successfully',
        }, {status: 200} );
    }
    catch(err){
        console.error('Error in resend-email route:', err);
        return NextResponse.json({
            success: false,
            message: 'Error resending verification email',
        }, {status: 500} );
    }
}