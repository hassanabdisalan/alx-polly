"use client";

import Link from "next/link";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Polly
          </Link>
          <MainNav />
        </div>
        <UserNav />
      </div>
    </header>
  );
}