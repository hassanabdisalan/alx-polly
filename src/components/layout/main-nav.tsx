"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Polls",
      href: "/polls",
    },
    {
      name: "Create Poll",
      href: "/polls/create",
    },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}