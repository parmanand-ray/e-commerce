"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "@/public/assets/images/logo-black.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import z from "zod";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
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
import {
  USER_DASHBOARD,
  WEBSITE_REGISTER,
  WEBSITE_RESETPASSWORD,
} from "@/routes/websiteRoutes";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import OTPVerification from "@/components/Application/OTPVerification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes";
function Login() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);

  const [isTypePass, setTypePass] = useState(true);
  const [otpEmail, setOtpEmail] = useState();
  const formSchema = zSchema
    .pick({
      email: true,
    })
    .extend({
      password: z.string().min(6, "password must be at least 6 character"),
    });

  const form = useForm({
    resolver: zodResolver(formSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: loginResponse } = await axios.post(
        "/api/auth/login",
        values
      );

      if (!loginResponse.success) {
        throw new Error(loginResponse.message);
      }
      setOtpEmail(values.email);
      form.reset();
      showToast("success", loginResponse.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (values) => {
    try {
      setOtpVerificationLoading(true);
      const { data: otpResponse } = await axios.post(
        "/api/auth/verify-otp",
        values
      );

      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }

      setOtpEmail("");
      showToast("success", otpResponse.message);

      dispatch(login(otpResponse.data));
      if(searchParams.has('callback')){
        router.push(searchParams.get('callback'));
      }else{
        otpResponse.data.role === 'admin' ? router.push(ADMIN_DASHBOARD) : router.push(USER_DASHBOARD)
      }
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
              <h1 className="text-3xl font-bold">Login Into Account</h1>
              <p>Login into your account by filling out the form below.</p>
            </div>

            <div className="mt-5">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
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

                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type={isTypePass ? "password" : "text"}
                              placeholder="******"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setTypePass(!isTypePass)}
                            className="absolute top-1/2 right-2 cursor-pointer"
                          >
                            {isTypePass ? <FaRegEyeSlash /> : <FaRegEye />}
                          </button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <ButtonLoading
                      type="submit"
                      text="Login"
                      loading={loading}
                      // onClick={handleLoginSubmit}
                      className={"w-full cursor-pointer bg-violet-500 "}
                    />
                  </div>

                  <div className="text-center">
                    <div className="flex justify-center gap-1">
                      <p>Don't have account</p>
                      <Link
                        href={WEBSITE_REGISTER}
                        className="text-violet-600 underline"
                      >
                        Create Account!
                      </Link>
                    </div>
                    <div className="mt-2">
                      <Link
                        href={WEBSITE_RESETPASSWORD}
                        className="text-violet-600 underline"
                      >
                        Forget Password?
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <>
            <OTPVerification
              email={otpEmail}
              loading={otpVerificationLoading}
              onSubmit={handleOtpVerification}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default Login;
