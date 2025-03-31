"use client";

import { signOut } from "@/app/(auth)/actions";

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Sign Out
      </button>
    </form>
  );
}
