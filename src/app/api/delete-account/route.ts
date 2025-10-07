import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import connectDB from "@/lib/dbConnection";
import User from "@/model/User";
import Message from "@/model/Message";


export async function DELETE() {
  try {
    const session = await getServerSession(options);
    const user = session?.user;
        if(!session || !user){
            return new Response(JSON.stringify({
                success: false,
                message: "User is not authenticated"
            }), {status: 401});
        }
    await connectDB();
    const existingUser = await User.findById(user._id);
    if (!existingUser) {
        return NextResponse.json({
        success: false,
        message: "User does not exist",
        }, {status: 404});
    }
    await Message.deleteMany({ _id: { $in: existingUser.messages } });
    await User.findByIdAndDelete(user._id);
    return NextResponse.json({
        success: true,
        message: "User deleted successfully",
    }, {status: 200})
  } 
  catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({
        success: false,
        message: "Error deleting user",
    }, {status: 500})
  }
}
