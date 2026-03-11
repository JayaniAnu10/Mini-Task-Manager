"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, CheckSquare } from "lucide-react";
import { registerUser } from "@/lib/authApi";
import { getApiErrorMessage } from "@/lib/apiClient";

interface FormErrors {
  email?: string;
  password?: string;
  confirm?: string;
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const router = useRouter();
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Your account has been created successfully.");
      router.push("/login");
    },
    onError: (err) => {
      const message = getApiErrorMessage(
        err,
        "Registration failed. Please try again.",
      );
      setError(message);
      toast.error(message);
    },
  });

  const validate = () => {
    const e: FormErrors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (!confirm) e.confirm = "Please confirm your password";
    else if (confirm !== password) e.confirm = "Passwords do not match";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    await registerMutation.mutateAsync({
      email,
      password,
      confirmPassword: confirm,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 px-4 py-10">
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500">
          <CheckSquare className="h-8 w-8 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Create account
        </h1>
        <p className="mt-2 text-base text-slate-500 md:text-xl">
          Start managing your tasks today
        </p>

        <div className="mt-3 rounded-3xl bg-white p-6 text-left shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              icon={<Mail className="h-5 w-5" />}
              className="h-11 rounded-xl border-slate-200 bg-slate-100 pl-11 text-base text-slate-700 placeholder:text-slate-400"
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              icon={<Lock className="h-5 w-5" />}
              className="h-11 rounded-xl border-slate-200 bg-slate-100 pl-11 text-base text-slate-700 placeholder:text-slate-400"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={fieldErrors.confirm}
              icon={<Lock className="h-5 w-5" />}
              className="h-11 rounded-xl border-slate-200 bg-slate-100 pl-11 text-base text-slate-700 placeholder:text-slate-400"
            />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              loading={registerMutation.isPending}
              className="mt-1 h-11 w-full rounded-xl bg-blue-500 text-base font-semibold text-white hover:bg-blue-600"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-base text-slate-500 md:text-lg">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-500 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
