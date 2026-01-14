"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "@/public/assets/images/logo-black.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/ButtonLoading";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/websiteRoutes";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import OTPVerification from "@/components/Application/OTPVerification";

import UpdatePassword from "@/components/Application/UpdatePassword";
function ResetPassword() {
  const [emailVerificatonLoading, setEmailVerificatonLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
   const [otpEmail, setOtpEmail] = useState();
  const formSchema = zSchema.pick({
    email: true,
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleEmailVerification = async (values) => {

    try {
        setEmailVerificatonLoading(true);
        const { data: sendOtpResponse } = await axios.post(
          "/api/auth/reset-password/send-otp",
          values
        );

        if (!sendOtpResponse.success) {
          throw new Error(sendOtpResponse.message);
        }

        setOtpEmail(values.email);
        showToast("success", sendOtpResponse.message); 
      } catch (error) {
        showToast("error", error.message);
      } finally {
        setEmailVerificatonLoading(false);
      }

   };
    const handleOtpVerification = async (values) => {
      try {
        setOtpVerificationLoading(true);
        const { data: otpResponse } = await axios.post(
          "/api/auth/reset-password/verify-otp",
          values
        );

        if (!otpResponse.success) {
          throw new Error(otpResponse.message);
        }
        showToast("success", otpResponse.message);  
        setIsOtpVerified(true);
      } catch (error) {
        showToast("error", error.message);
      } finally {
        setOtpVerificationLoading(false);
      }
    };
 

  return (
    <Card className="w-[400px]">
      <CardContent>
        <div className="flex justify-center">
          <Image
            src={Logo.src}
            width={Logo.width}
            height={Logo.height}
            className="max-w-[200px]"
            alt="logo"
          />
        </div>
        {!otpEmail ? (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold">Reset Password</h1>
              <p>Enter Your Email for Reset Password</p>
            </div>

            <div className="mt-5">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEmailVerification)}>
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@gmail.com"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <ButtonLoading
                      type="submit"
                      text="Send OTP"
                      loading={emailVerificatonLoading}
                      className={"w-full cursor-pointer bg-violet-500"}
                    />
                  </div>

                  <div className="text-center">
                    <div className="mt-2">
                      <Link
                        href={WEBSITE_LOGIN} 
                        className="text-violet-600 underline"
                      >
                        Back To Login
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <>
          {!isOtpVerified ? 
            <OTPVerification
              email={otpEmail}
              loading={otpVerificationLoading}
              onSubmit={handleOtpVerification}
            />
            :
            <UpdatePassword email={otpEmail}/>  
        
        }
            
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ResetPassword;
