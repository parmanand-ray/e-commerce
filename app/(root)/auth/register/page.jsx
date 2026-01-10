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
import { WEBSITE_LOGIN, WEBSITE_REGISTER } from "@/routes/websiteRoutes";
import axios from "axios";
import { showToast } from "@/lib/showToast";

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [isTypePass, setTypePass] = useState(true);
  const formSchema = zSchema
    .pick({
      email: true,
      name: true,
      password: true,
    })
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password Not Matched",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegisterSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: registerResponse } = await axios.post(
        "/api/auth/register",
        values
      );

      if (!registerResponse.success) {
        throw new Error(registerResponse.message);
      }

      form.reset();
      showToast("success", registerResponse.message);
    } catch (error) {
      showToast("error", error.message);
      
    } finally {
      setLoading(false);
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
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account !</h1>
          <p>Create new account by filling out the form below.</p>
        </div>

        <div className="mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegisterSubmit)}>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Evew" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                          type="password"
                          placeholder="******"
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Confirm Password</FormLabel>
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
                  text="Create Account"
                  loading={loading}
                  // onClick={handleRegisterSubmit}
                  className={"w-full cursor-pointer bg-violet-500"}
                />
              </div>

              <div className="text-center">
                <div className="flex justify-center gap-1">
                  <p>Already have account</p>
                  <Link
                    href={WEBSITE_LOGIN}
                    className="text-violet-600 underline"
                  >
                    Login
                  </Link>
                </div>
                <div className="mt-2">
                  <Link href="" className="text-violet-600 underline">
                    Forget Password?
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}

export default RegisterPage;
