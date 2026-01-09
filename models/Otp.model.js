import mongoose from "mongoose";
import { email } from "zod";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    otp: {
      type: String,
      require: true,
    },
    expiresAt: {
      type: Date,
      require: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
  },
  { timestamps: true }
);

otpSchema.index({expiresAt:1},{expireAfterSeconds:0});

const OTPModel = mongoose.models.OTP || mongoose.model('OTP',otpSchema,'otps');

export default OTPModel;