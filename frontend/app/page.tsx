"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/authApi";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    getMe()
      .then((me) => {
        if (me.role === "ADMIN") {
          router.replace("/admin");
        } else {
          router.replace("/tasks");
        }
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  return null;
}
