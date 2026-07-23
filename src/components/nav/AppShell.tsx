"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProfileMenu } from "@/components/nav/ProfileMenu";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/log", label: "Log Workout" },
  { href: "/history", label: "History" },
  { href: "/exercises", label: "Exercises" },
];

export function AppShell({
  userName,
  userEmail,
  userImage,
  children,
}: {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="bg-muted/30 flex min-h-full flex-1 flex-col">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <nav className="flex items-center gap-0.5 overflow-x-auto sm:gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative shrink-0 px-1.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors sm:px-2",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive && <span className="bg-primary absolute inset-x-1.5 -bottom-[13px] h-0.5 rounded-full sm:inset-x-2" />}
                </Link>
              );
            })}
          </nav>
          <ProfileMenu name={userName} email={userEmail} image={userImage} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
