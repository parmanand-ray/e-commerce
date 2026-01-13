import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/dbconn";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { email } from "zod";

export async function POST(request) {
    try {
        await connectDB();
        const payload = await request.json();
        const validatedSchema = zSchema.pick({
            email:true,
        })
        const validatedData = validatedSchema.safeParse(payload);
        if(!validatedData.success){
            return response(false,401,'Invalid data or Missing Input Feild',validatedData.error);
        }

        const {email} = validatedData.data;

        const getUser = await UserModel.findOne({deletedAt:null,email});
        if(!getUser){
            return response(false,404,'User Not Found');
        }
        //delete old OTPs
        await OTPModel.deleteMany({email});
        const otp = generateOTP();
        //saving otp into db
        const newOtpdata = new OTPModel({email,otp});
        await newOtpdata.save();
        const otpSendStatus = await sendMail('Your Login Verification Code',email,otpEmail(otp));
        if(!otpSendStatus.success){
            return response(false,401,'feild to send OTP');

        }
        return response(true,200,'OTP send sucessfully..');

    } catch (error) {
        catchError(error);
    }
}