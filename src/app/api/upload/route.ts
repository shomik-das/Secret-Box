import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("image") as File;

    if (!file) {
      return NextResponse.json({
        success: false, 
        message: "No file uploaded" 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise<{ secure_url: string; url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "secret-box" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          }
          else {
            resolve(result as { secure_url: string; url: string; public_id: string });
          }
        }
      );
      stream.end(buffer);
    });

    if(!upload){
        return NextResponse.json({ 
            success: false, 
            message: "Upload failed" 
        }, { status: 500 });
    }
    return NextResponse.json({ 
        success: true, 
        message: "Upload successful", 
        url: upload.secure_url 
    }, { status: 200 });
  }
  catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ 
        success: false, 
        message: "Upload failed" 
    }, { status: 500 });
  }
}
