"use client";
import { useState, useEffect } from "react";
import AnimatedDiv from "@/components/AnimatedDiv";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function Home() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prevStep) => (prevStep < 3 ? prevStep + 1 : prevStep));
    }, 3000); // 2 seconds per step
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center h-dvh p-4 text-center">
      <div className="max-w-sm">
        {step === 0 && (
          <AnimatedDiv>
            <h1 className="font-light text-3xl">Hello.</h1>
          </AnimatedDiv>
        )}
        {step === 1 && (
          <AnimatedDiv>
            <h1 className="font-light text-3xl">I&apos;m Clai.</h1>
          </AnimatedDiv>
        )}
        {step === 2 && (
          <AnimatedDiv>
            <h1 className="font-light text-2xl">
              I can help you learn any topic you want, in just three minutes a
              day
            </h1>
          </AnimatedDiv>
        )}
        {step === 3 && (
          <AnimatedDiv>
            <h1 className="font-light text-2xl">
              Are you ready to get started?
            </h1>
            <Button className="mt-4" onClick={() => router.push("/sign-in")}>
              Let&apos;s Go
            </Button>
          </AnimatedDiv>
        )}
      </div>
    </div>
  );
}
