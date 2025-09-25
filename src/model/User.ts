import mongoose, { Document, Schema } from 'mongoose';


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerify: boolean;
    isAcceptingMessages: boolean;
    resetToken?: string;
    resetTokenExpiry?: Date;
    otpSession ?: boolean;
    otpSessionExpiry ?: Date;
    messages: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify code expiry is required'],
    },
    isVerify: {
        type: Boolean,
        default: false,
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiry: {
        type: Date,
    },
    otpSession: {
        type: Boolean,
        default: false,
    },
    otpSessionExpiry: {
        type: Date,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User', userSchema); //If User model already exists in mongoose.models (because the file ran earlier), reuse it.



// We need this in Next.js because:
// Next.js uses hot reloading and sometimes runs your code multiple times (especially in dev mode).
// Next.js reloads files many times (during dev, SSR, API calls).
// Without this check, Mongoose would crash by redefining models.
// With this pattern, your models are defined only once and reused safely.
