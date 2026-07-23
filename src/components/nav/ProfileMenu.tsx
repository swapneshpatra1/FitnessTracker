"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { LogOutIcon, MoonIcon, SunIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOutAction } from "@/lib/actions";

export function ProfileMenu({
  name,
  email,
  image,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const initials = name?.trim().charAt(0).toUpperCase() || email?.trim().charAt(0).toUpperCase() || "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<button type="button" aria-label="Account menu" className="rounded-full" />}
      >
        <Avatar>
          {image && <AvatarImage src={image} alt={name ?? "Account"} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        {(name || email) && (
          <>
            <div className="flex flex-col gap-0.5 px-2 py-1.5">
              {name && <span className="truncate text-sm font-medium">{name}</span>}
              {email && <span className="text-muted-foreground truncate text-xs">{email}</span>}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem render={<Link href="/profile" />}>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
          {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
          {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => signOutAction()}>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
