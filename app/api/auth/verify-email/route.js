import { connectDB } from "@/lib/dbconn";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import { jwtVerify } from "jose";

export async function POST(request) {
  try {
    await connectDB();

    const { token } = await request.json();
    if (!token) {
      return response(false, 400, "Missing Token");
    }
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const decoded = await jwtVerify(token,secret);
    const userId = decoded.payload.userId;

    //get user
    const user = await UserModel.findById(userId);

    if(!user){
        return response(false,404,'User Not Found');
    }
    user.isEmailVerified = true;

    await user.save();
    return response(true,200,'Email Varification Successful.');
  } catch (error) {
    catchError(error);
  }
}
