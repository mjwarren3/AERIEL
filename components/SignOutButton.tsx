"use client";

import { signOut } from "@/app/(auth)/actions";

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="px-4 py-2 border-red-500 border-2 font-semibold cursor-pointer hover:bg-red-500 hover:text-white text-red-500 rounded-lg w-full"
      >
        Sign Out
      </button>
    </form>
  );
}
