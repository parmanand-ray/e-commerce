import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/dbconn";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    await connectDB();

    // validation schema
    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await request.json();
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(
        false,
        400,
        "Invalid or missing input field",
        validatedData.error
      );
    }

    const { name, email, password } = validatedData.data;

    //check already registerd user
    const checkUser = await UserModel.exists({ email });
    if (checkUser) {
      return response(true, 409, "User already registered");
    }

    //create new user
    const newRegistation = new UserModel({
      name,
      email,
      password,
    });

    await newRegistation.save();
    
    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY not defined");
    }
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT({ userId: newRegistation._id.toString() })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);
     console.log("url : " + process.env.NEXT_PUBLIC_BASE_URL);
    const mailResponse = await sendMail(
      "Email Varification from Devloper Parmanand",
      email,
      emailVerificationLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/varify-email/${token}`
      )

     
      
    );

    if (!mailResponse.success) {
      return response(false, 500, "Email sending failed", mailResponse.message);
    }

    return response(true, 201, "Registration successful. Verify email.");
  } catch (error) {
    console.log(error);

    return catchError(error, "Registration failed");
  }
}
