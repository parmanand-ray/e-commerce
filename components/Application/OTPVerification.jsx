import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ButtonLoading from "@/components/Application/ButtonLoading";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function OTPVerification({ email, onSubmit, loading }) {
  const formSchema = zSchema.pick({
    email: true,
    otp: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email: email,
    },
  });

  const handleOtpVarification = async (values) => {
    onSubmit(values);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOtpVarification)}>
          <div className="text-center my-1.5">
            <h1 className="font-bold text-2xl"> Please Verify Your OTP</h1>
            <p className="text-md">
              We have send a OTP to your registered Email. The OTP is valid for
              10 Minuts.{" "}
            </p>
          </div>
          <div className="my-5 flex justify-center">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Enter Your OTP
                  </FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-3">
            <ButtonLoading
              type="submit"
              text="Verify"
              loading={loading}
              className={"w-full cursor-pointer bg-violet-500"}
            />
            <div className="text-center mt-5">
              <button
                type="submit"
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default OTPVerification;
