import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import sendEmail from "@/helper/sendLinkEmail";
import { NextResponse } from "next/server";
import crypto from "crypto";

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
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();
        const resetLink = `${process.env.HOST}/auth/reset-password/${user.username}?token=${resetToken}`;

        const emailResponse = await sendEmail(user.email, user.username, resetLink);
        if(!emailResponse.success){
            return NextResponse.json({
                success: false,
                message: 'Error sending reset email',
            }, {status: 500} );
        }
        return NextResponse.json({
            success: true,
            message: 'Reset email sent successfully',
            data: {
                email: user.email,
                username: user.username,
            }
        }, {status: 200} );
    }
    catch(err){
        console.error('Error in reset-link route:', err);
        return NextResponse.json({
            success: false,
            message: 'Error sending reset email',
        }, {status: 500} );
    }
}