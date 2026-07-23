import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { WelcomeFlow } from "@/components/onboarding/WelcomeFlow";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <WelcomeFlow />;
}
