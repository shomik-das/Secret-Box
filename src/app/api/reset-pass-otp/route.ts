import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import sendEmail from "@/helper/sendEmail";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
    try{
        await dbConnection();
        const {email} = await request.json();
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({
                success: false,
                message: 'User does not exist with this email',
            }, {status: 404} );
        }
        if(!user.isVerify){
            return NextResponse.json({
                success: false,
                message: 'User is not verified. Please sign up first',
            }, {status: 403} );
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
                message: 'Error sending verification email',
            }, {status: 500} );
        }
        return NextResponse.json({
            success: true,
            message: 'Verification email sent successfully',
            data: {
                email: user.email,
                username: user.username,
            }
        }, {status: 200} );
    }
    catch(err){
        console.error('Error in reset-pass-otp route:', err);
        return NextResponse.json({
            success: false,
            message: 'Error sending verification email',
        }, {status: 500} );
    }
}