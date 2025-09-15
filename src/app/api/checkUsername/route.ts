import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import {z} from "zod";
import { signUpSchema } from "@/schema/signUpSchema";

const usernameSchema = z.object({
    username: signUpSchema.shape.name,
})

export async function GET(request: Request) {
    try{
        await dbConnection();
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");
        if(!username){
            return new Response(JSON.stringify({
                success: false,
                message: "Username is required"
            }), {status: 400});
        }
        const result = usernameSchema.safeParse({username: username});
        if(!result.success){
            const usernameError = result.error.format().username?._errors || [];
            return new Response(JSON.stringify({
                success: false,
                message: usernameError
            }), {status: 400});
        }
        const user = await User.findOne({username, isVerifying: true});
        if(user){
            return new Response(JSON.stringify({
                success: false,
                message: "Username is already taken"
            }), {status: 400});
        }
        return new Response(JSON.stringify({
            success: true,
            message: "Username is available"
        }), {status: 200});
    }
    catch(err){
        console.error("Error checking username:", err);
        return new Response(JSON.stringify({
            success: false,
            message: "Error checking username"
        }), {status: 500});
    }
}