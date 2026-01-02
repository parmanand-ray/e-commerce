import { connectDB } from "@/lib/dbconn.js";
import { NextResponse } from "next/server";


export async function GET() {
    await connectDB();

    return NextResponse.json({
        success:true,
        message:'connection sucessfully complited !'
    })
}