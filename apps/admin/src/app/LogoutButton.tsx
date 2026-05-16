"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    if (loading) {
      return;
    }

    setLoading(true);

    const response = await fetch("/api/auth", {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/");
      return;
    }

    setLoading(false);
  }

  return (
    <button
      className={styles.button}
      type="button"
      disabled={loading}
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
