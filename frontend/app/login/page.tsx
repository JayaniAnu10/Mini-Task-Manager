"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, CheckSquare } from "lucide-react";
import { loginUser } from "@/lib/authApi";
import { getMe } from "@/lib/authApi";
import { getApiErrorMessage } from "@/lib/apiClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async ({ token }) => {
      localStorage.setItem("accessToken", token);
      try {
        const me = await getMe();
        toast.success("You have signed in successfully.");
        if (me.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/tasks");
        }
      } catch {
        toast.success("You have signed in successfully.");
        router.push("/tasks");
      }
    },
    onError: (err) => {
      const message = getApiErrorMessage(
        err,
        "Login failed. Please check your credentials.",
      );
      setError(message);
      toast.error(message);
    },
  });

  const validate = () => {
    const e: typeof fieldErrors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    await loginMutation.mutateAsync({ email, password });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 px-4 py-10">
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500">
          <CheckSquare className="h-8 w-8 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-base text-slate-500 md:text-xl">
          Sign in to manage your tasks
        </p>

        <div className="mt-6 rounded-2xl bg-blue-100 px-4 py-3 text-center md:px-6">
          <p className="text-base font-semibold text-blue-700 ">
            Admin Demo: admin@gmail.com / admin123
          </p>
        </div>

        <div className="mt-3 rounded-3xl bg-white p-6 text-left shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="you@gmail.com"
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

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              loading={loginMutation.isPending}
              className="mt-1 h-11 w-full rounded-xl bg-blue-500 text-base font-semibold text-white hover:bg-blue-600"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-base text-slate-500 ">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-500 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
