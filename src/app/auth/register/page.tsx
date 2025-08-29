import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Create an account</h1>
          <p className="text-muted-foreground">
            Join PollApp to start creating and voting on polls
          </p>
        </div>
        
        <RegisterForm />
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login">
              <Button variant="link" className="p-0 h-auto">
                Sign in
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
