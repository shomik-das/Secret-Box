import dbConnection from "@/lib/dbConnection";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import sendEmail from "@/helper/sendEmail";

export const POST = async (request: Request) => {
    try{
        await dbConnection(); //must do await here
        const {username, email, password} = await request.json();
        //Check if user with same username already exists
        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return Response.json({
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
                return Response.json({
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
                messages: [],
            });
            if(!newUser){
                return Response.json({
                    success: false,
                    message: 'Error creating user',
                }, {status: 500} );
            }
        }
        const emailResponse = await sendEmail(email, username, verifyCode);
        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: 'Error sending verification email',
            }, {status: 500} );
        }
        return Response.json({
            success: true,
            message: 'User registered successfully please verify your email',
        }, {status: 201} );
    }
    catch(err){
        console.error('Error in signUp route:', err);
        return Response.json({
            success: false,
            message: 'Internal Server Error',
        }, {status: 500} );
    }
}