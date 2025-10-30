import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import sendEmail from "@/helper/sendOtpEmail";
import { NextResponse } from "next/server";
import { signUpSchema } from "@/schema/signUpSchema";

export const POST = async (request: Request) => {
    try{
        await dbConnection(); //must do await here
        const {username, email, password} = await request.json();
        const result = signUpSchema.safeParse({username, email, password});
        if(!result.success){
            const errors = result.error.format();
            const usernameError = errors.username?._errors.join(", ");
            const emailError = errors.email?._errors.join(", ");
            const passwordError = errors.password?._errors.join(", ");

            const errorMessages = [usernameError, emailError, passwordError]
                .filter(Boolean)
                .join(" | ");
            return NextResponse.json({
                success: false,
                message: errorMessages || "Invalid input data",
            }, {status: 400} );
        }
        //Check if user with same username already exists
        const existingUsername = await User.findOne({username});
        if(existingUsername && existingUsername.isVerify){
            return NextResponse.json({
                success: false,
                message: 'Username already exists',
            }, {status: 400} );
        }
        //check if email already exists
        const existingEmail = await User.findOne({email});

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyCodeExpiry = new Date();
        verifyCodeExpiry.setMinutes(verifyCodeExpiry.getMinutes() + 10);
        
        // If email already exists, check if user is verifying or not
        if(existingEmail){
            // If user is already verifying, do not allow to sign up again with same email
            if(existingEmail.isVerify){
                return NextResponse.json({
                    success: false,
                    message: 'User already exists with this email',
                }, {status: 400} );
            }
            // If user is not verifying, update the existing user with new details then send verification email
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingEmail.username = username;
                existingEmail.password = hashedPassword;
                existingEmail.verifyCode = verifyCode;
                existingEmail.verifyCodeExpiry = verifyCodeExpiry;
                await existingEmail.save();
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry,
                image: `https://ui-avatars.com/api/?name=${username}&background=random&size=128`,
                messages: [],
                
            });
            if(!newUser){
                return NextResponse.json({
                    success: false,
                    message: 'Error creating user',
                }, {status: 500} );
            }
        }
        const emailResponse = await sendEmail(email, username, verifyCode);
        if(!emailResponse.success){
            return NextResponse.json({
                success: false,
                message: 'Error sending verification email',
            }, {status: 500} );
        }
        return NextResponse.json({
            success: true,
            message: 'Please verify your email',
        }, {status: 201} );
    }
    catch(err){
        console.error('Error in sign-up route:', err);
        return NextResponse.json({
            success: false,
            message: 'Error in sign-up route',
        }, {status: 500} );
    }
}