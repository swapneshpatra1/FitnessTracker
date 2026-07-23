import { requireProfile } from "@/lib/dal";
import { auth } from "@/lib/auth";
import { AppShell } from "@/components/nav/AppShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireProfile();
  const session = await auth();

  return (
    <AppShell userName={session?.user?.name} userEmail={session?.user?.email} userImage={session?.user?.image}>
      {children}
    </AppShell>
  );
}
