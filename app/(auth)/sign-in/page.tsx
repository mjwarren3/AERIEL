"use client";

import { useState } from "react";
import AnimatedDiv from "@/components/AnimatedDiv";
import { signUp, verify } from "../actions";
import Button from "@/components/Button";
import { ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [phone, setPhone] = useState("");

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let phoneNumber = formData.get("phone") as string;

    // Prepend '1' if the phone number is exactly 10 digits
    if (/^\d{10}$/.test(phoneNumber)) {
      phoneNumber = `1${phoneNumber}`;
    }

    setPhone(phoneNumber); // Save the phone number for the verification step
    formData.set("phone", phoneNumber); // Update the phone number with the prepended '1'

    await signUp(formData); // Call the signUp action
    setIsVerificationStep(true); // Move to the verification step
  };

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("phone", phone); // Use the saved phone number for verification

    await verify(formData); // Call the verify action
  };

  return (
    <form
      onSubmit={isVerificationStep ? handleVerify : handleSignUp}
      className="w-full flex flex-col justify-center items-center h-dvh p-4 text-center"
    >
      <AnimatedDiv className="w-full max-w-sm">
        <h1 className="text-2xl w-full">
          {isVerificationStep ? "Verify Your Phone" : "Stay Curious"}
        </h1>
        <p className="text-gray-700 w-full text-center text-sm">
          Enter your phone number to access Clai
        </p>

        {!isVerificationStep ? (
          <div className="flex gap-2 items-center mt-4 w-full">
            <div className="flex w-full gap-2">
              <input
                type="text"
                name="phone"
                className="flex-grow border-2 border-black rounded-lg py-2 px-4 dark:border-white"
                placeholder="Phone Number"
                required
              />
              <Button type="submit" className="flex-shrink-0">
                <ArrowRight />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center mt-4 w-full">
            <input
              type="text"
              name="code"
              className="flex-grow border-2 border-black rounded-lg py-2 px-4 dark:border-white"
              placeholder="Verification Code"
              required
            />
            <Button type="submit" className="flex-shrink-0">
              <ArrowRight />
            </Button>
          </div>
        )}

        {!isVerificationStep && (
          <p className="text-gray-700 w-full text-center mt-1 text-sm">
            US Phone Numbers only
          </p>
        )}
      </AnimatedDiv>
    </form>
  );
}
