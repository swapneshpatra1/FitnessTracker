"use server";

import { signIn, signOut } from "@/lib/auth";

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function signInWithGoogleAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}
