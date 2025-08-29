"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold">
            PollApp
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/polls" className="text-sm font-medium hover:text-primary">
              View Polls
            </Link>
            <Link href="/polls/create" className="text-sm font-medium hover:text-primary">
              Create Poll
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
