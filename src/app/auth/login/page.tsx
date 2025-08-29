import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        
        <LoginForm />
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/register">
              <Button variant="link" className="p-0 h-auto">
                Sign up
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
