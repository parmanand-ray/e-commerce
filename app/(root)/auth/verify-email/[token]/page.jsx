'use client'

import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import verifiedImg from "@/public/assets/images/verified.gif";
import verifiedFailedImg from "@/public/assets/images/verification-failed.gif";
import { Button } from "@/components/ui/button";
import { WEBSITE_HOME } from "@/routes/websiteRoutes";

const EmailVerification = ({ params }) => {
  const { token } = use(params) // ✅ FIXED


  const [isVerified, setIsVerified] = useState(null); // null = loading

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.post("/api/auth/verify-email", { token });
        setIsVerified(data.success);
      } catch (err) {
        setIsVerified(false);
      }
    };
    verify();
  }, [token]);

  if (isVerified === null) {
    return <p className="text-center">Verifying...</p>;
  }

  return (
    <Card className="w-[400px]">
      <CardContent>
        {isVerified ? (
          <div>
            <div className="flex justify-center">
              <Image
                {...verifiedImg}
                alt="Email Verification Success"
                className="h-[100px] w-auto"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold my-5 text-green-500">
                Email verification successful!
              </h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-center">
              <Image
                {...verifiedFailedImg}
                alt="Email Verification Failed"
                className="h-[100px] w-auto"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold my-5 text-red-500">
                Email verification failed!
              </h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
