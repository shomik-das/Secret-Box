import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import {z} from "zod";

import { verifySchema } from "@/schema/verifySchema";
const verifyCodeSchema = z.object({
    code: verifySchema.shape.code,
})

export async function POST(request: Request) {
    try{
        await dbConnection();
        const {username, code} = await request.json();
        const result = verifyCodeSchema.safeParse({code: code});
        if(!result.success){
            const codeError = result.error.format().code?._errors || [];
            return new Response(JSON.stringify({
                success: false,
                message: codeError
            }), {status: 400});
        }
        const user = await User.findOne({username})
        if(!user){
            return new Response(JSON.stringify({
                success: false,
                message: "No user found"
            }), {status: 400});
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
        user.isVerifying = true;
        user.verifyCode = "";
        user.verifyCodeExpiry = new Date(0);
        await user.save();

        return new Response(JSON.stringify({
            success: true,
            message: "Email verified successfully"
        }), {status: 200});
    }
    catch(err){
        console.error("Error verifying code:", err);
        return new Response(JSON.stringify({
            success: false,
            message: "Error verifying code"
        }), {status: 500});
    }
}