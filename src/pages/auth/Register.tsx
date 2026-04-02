// src/pages/auth/Register.tsx
import { useState } from "react";
import { useRegister } from "@/features/auth/hooks";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, AlertCircle, Loader2, Sparkles } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useRegister();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, { onSuccess: () => navigate("/login") });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow using primary color */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand mark */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground tracking-tight">
              Cinedrishti
            </span>
          </div>
        </div>

        <Card className="border-border shadow-xl bg-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="font-heading text-2xl font-bold text-card-foreground text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-muted-foreground text-center text-sm">
              Enter your details to get started for free
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-foreground font-medium text-sm">
                  Full name
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="h-10 bg-background border-input focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground font-medium text-sm">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="h-10 bg-background border-input focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-foreground font-medium text-sm">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="h-10 bg-background border-input focus-visible:ring-ring"
                />
              </div>

              {isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {(error as Error)?.message || "Registration failed. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create account
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pt-0 pb-5">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;