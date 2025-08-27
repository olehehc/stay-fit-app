"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import signUpAction from "@/app/auth/sign-up/action";

export default function SignUpCard() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signUpAction, {
    errors: null,
    data: {},
  });

  useEffect(() => {
    if (state.ok) {
      toast("Registration successful! Redirecting...");
      const timer = setTimeout(() => {
        router.push("/auth/sign-in");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state.ok, router]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create a new account</CardTitle>
        <CardDescription>Enter your details below to register</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-6" noValidate action={formAction}>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="username"
              defaultValue={state.data?.username}
              className={state.errors?.username && "border-destructive"}
            />
            {state.errors?.username && (
              <p className="text-xs text-destructive">
                {state.errors.username}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              defaultValue={state.data?.email}
              className={state.errors?.email && "border-destructive"}
            />
            {state.errors?.email && (
              <p className="text-xs text-destructive">{state.errors.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              className={state.errors?.password && "border-destructive"}
            />
            {state.errors?.password && (
              <ul
                className={
                  state.errors?.password.length > 1
                    ? "text-xs text-destructive list-disc pl-5"
                    : "text-xs text-destructive"
                }
              >
                {state.errors?.password.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={state.errors?.confirmPassword && "border-destructive"}
            />
            {state.errors?.confirmPassword && (
              <p className="text-xs text-destructive">
                {state.errors.confirmPassword}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button asChild variant="link" className="w-full">
          <Link href="/auth/sign-in">Already have an account? Sign In</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
