import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import {z} from "zod";
import { rateLimit } from "@/lib/rateLimit";

import { verifySchema } from "@/schema/verifySchema";
const verifyCodeSchema = z.object({
    code: verifySchema.shape.code,
})

export async function POST(request: Request) {
    try{
        const ip = request.headers.get("x-forwarded-for") || "anonymous";
        const limitResult = await rateLimit(ip, 5, 60);
        if (!limitResult.success) {
            return new Response(
                JSON.stringify({
                success: false,
                message: limitResult.message,
            }),{ status: 429 });
        }
        const {username, code} = await request.json();
        if(!username || !code){
            return new Response(JSON.stringify({
                success: false,
                message: "Username and code are required"
            }), {status: 400});
        }
        const result = verifyCodeSchema.safeParse({code: code});
        if(!result.success){
            const codeError = result.error.format().code?._errors || [];
            return new Response(JSON.stringify({
                success: false,
                message: codeError
            }), {status: 400});
        }
        await dbConnection();
        const user = await User.findOne({username})
        if(!user){
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }), {status: 404});
        }
        const isCodeValid = user.verifyCode === code
        const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();
        if(isCodeExpired){
            return new Response(JSON.stringify({
                success: false,
                message: "Verification code has expired"
            }), {status: 400});
        }
        if(!isCodeValid){
            return new Response(JSON.stringify({
                success: false,
                message: "Invalid verification code"
            }), {status: 400});
        }
        user.isVerify = true;
        user.verifyCode = "USED";
        user.verifyCodeExpiry = new Date(0);
        user.otpSession = true;
        user.otpSessionExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        const updatedUser = await user.save();
        if(!updatedUser){
            console.log("Error in updating user") 
        }
        return new Response(JSON.stringify({
            success: true,
            message: "Email verified successfully"
        }), {status: 200});
    }
    catch(err){
        console.error("Error in verify-otp route: ", err);
        return new Response(JSON.stringify({
            success: false,
            message: "Error verifying email"
        }), {status: 500});
    }
}