"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const phone = formData.get("phone") as string;

  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) {
    redirect("/error");
  } else {
    redirect(`/verify?phone=${encodeURIComponent(phone)}`);
  }
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const phone = formData.get("phone") as string;

  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) {
    redirect("/error");
  } else {
    console.log("Successful sign up");
  }
}

export async function verify(formData: FormData) {
  const supabase = await createClient();
  const phone = formData.get("phone") as string;
  const code = formData.get("code") as string;

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token: code,
    type: "sms",
  });

  if (error) {
    redirect("/error");
  } else {
    redirect("/app");
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
