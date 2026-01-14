import { connectDB } from "@/lib/dbconn";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { sendMail } from "@/lib/sendMail";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import z from "zod";
import OTPModel from "@/models/Otp.model";
import { otpEmail } from "@/email/otpEmail";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();
    const validationSchema = zSchema
      .pick({
        email: true,
      })
      .extend({
        password: z.string().min(1, "Password is required"),
      });

    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(
        false,
        401,
        "invalid or missing input field",
        validatedData.error
      );
    }

    const { email, password } = validatedData.data;
    //get User

    const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
      "+password"
    );

    if (!getUser) {
      return response(false, 404, "Invalid Login Credentials");
    }

    const isPasswordVerified = await getUser.comparePassword(password);

    if (!isPasswordVerified) {
      return response(false, 404, "Invalid Login Credentials");
    }
    if (!getUser.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);

      const token = await new SignJWT({ userId: getUser._id.toString() })
        .setIssuedAt()
        .setExpirationTime("1h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);
      console.log("url : " + process.env.NEXT_PUBLIC_BASE_URL);
      const mailResponse = await sendMail(
        "Email Verification from Devloper Parmanand",
        email,
        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
        )
      );
      return response(
        false,
        401,
        "Your email is not verified. We have sent a verification link to your registered email address."
      );
    }
    // OTP Generation
    await OTPModel.deleteMany({ email }); // deleting all OTps
    const otp = generateOTP();

    //saving otp into db
    const newOtpData = new OTPModel({
      email,
      otp,
    });

    await newOtpData.save();

    const otpEmailStatus = await sendMail(
      "Loging Verification code",
      email,
      otpEmail(otp)
    );
    
    if (!otpEmailStatus.success) {
      return response(false, 500, "Failed to send OTP");
    }

    return response(true, 200, "Please varify your device");
  } catch (error) {
    return catchError(error);
  }
}
