import { getAllProducts, getPurchases } from "@repo/db/client";
import Link from "next/link";
import { AdminList } from "./AdminList";
import { AdminSignIn } from "./AdminSignIn";
import { isLoggedIn } from "../utils/auth";
import { LogoutButton } from "./LogoutButton";
import styles from "./page.module.css";

export default async function Home() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <AdminSignIn />;
  }

  const [products, purchases] = await Promise.all([
    getAllProducts(),
    getPurchases(),
  ]);

  return (
    <main className={styles.main}>
      <div className={styles.toolbar}>
        <div>
          <p className={styles.eyebrow}>Dashboard</p>
          <h1 className={styles.title}>Store Admin</h1>
        </div>
        <div className={styles.actions}>
          <Link className={styles.secondaryButton} href="/products/create">
            Create Product
          </Link>
          <LogoutButton />
        </div>
      </div>

      <AdminList products={products} purchases={purchases} />
    </main>
  );
}
