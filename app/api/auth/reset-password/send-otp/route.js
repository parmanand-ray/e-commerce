import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/dbconn";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import OTPModel from "@/models/Otp.model";


export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();
    const validationSchema = zSchema.pick({
      email: true,
    });
    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid data or Missing Input Feild",
        validatedData.error
      );
    }

    //get Email
    const { email } = validatedData.data;
    //get user
    const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();

    if (!getUser) {
      return response(false, 404, "User Not Exits");
    }

    await OTPModel.deleteMany({ email });
    const otp = generateOTP();
    //saving otp into db
    const newOtpdata = new OTPModel({ email, otp });
    await newOtpdata.save();
    const otpSendStatus = await sendMail(
      "Your Login Verification Code",
      email,
      otpEmail(otp)
    );
    if (!otpSendStatus.success) {
      return response(false, 401, "feild to send OTP");
    }
    return response(true, 200, "Plese Verify your Account");
  } catch (error) {
    catchError(error);
  }
}
