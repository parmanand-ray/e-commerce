import { connectDB } from "@/lib/dbconn";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

 

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();
    
    const validationSchema = zSchema.pick({
        email:true, otp:true
    })

    const validatedData = validationSchema.safeParse(payload);

    if(!validatedData.success){
        return response(false,404,'Invalid or Missing input field', validatedData.error);
    }

    const {email, otp} = validatedData.data;

    const getOtpData = await OTPModel.findOne({email, otp});

    if(!getOtpData) {
        return response(false,404,'Invalid or Expire OTP', validatedData.error)
    }

    const getUser = await UserModel.findOne({deletedAt:null, email}).lean();

    if(!getUser){
        return response(false,404,'User Not Found !');

    }

    //remove otp after verification

    await getOtpData.deleteOne();

    return response(true,200,'OTP Verification Successfull.')
   
  } catch (error) {
    catchError(error);
  }
}
