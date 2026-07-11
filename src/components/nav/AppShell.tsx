import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/log", label: "Log Workout" },
  { href: "/history", label: "History" },
  { href: "/exercises", label: "Exercises" },
  { href: "/profile", label: "Profile" },
];

export function AppShell({
  userName,
  children,
}: {
  userName?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/30 flex min-h-full flex-1 flex-col">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV_LINKS.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href={link.href} />}
              >
                {link.label}
              </Button>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            {userName && <span className="text-muted-foreground hidden text-sm sm:inline">{userName}</span>}
            <ThemeToggle />
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
