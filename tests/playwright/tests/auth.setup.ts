import { test as setup } from "@playwright/test";
setup(
  "authenticate assignment 3",
  { tag: "@a3" },
  async ({ playwright }) => {
    const authFile = ".auth/user.json";

    const apiContext = await playwright.request.newContext();

    await apiContext.post("/api/auth", {
      data: JSON.stringify({ password: "admin123" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await apiContext.storageState({ path: authFile });
  },
);
