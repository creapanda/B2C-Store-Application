import {
  getAllPosts,
  getAllPurchases,
  getProductCategories,
  getProducts,
} from "@repo/db/client";
import Link from "next/link";
import { AdminList } from "./AdminList";
import { AdminSignIn } from "./AdminSignIn";
import {
  AdminStoreDashboard,
  type AdminProductView,
  type AdminPurchaseView,
} from "./AdminStoreDashboard";
import { isLoggedIn } from "../utils/auth";
import { LogoutButton } from "./LogoutButton";
import styles from "./page.module.css";

export default async function Home() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <AdminSignIn />;
  }

  const [posts, products, categories, purchases] = await Promise.all([
    getAllPosts(),
    getProducts({ includeInactive: true }),
    getProductCategories(),
    getAllPurchases(),
  ]);

  const productViews: AdminProductView[] = products.map((product) => ({
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }));

  const purchaseViews: AdminPurchaseView[] = purchases.map((purchase) => ({
    ...purchase,
    createdAt: purchase.createdAt.toISOString(),
    user: purchase.user
      ? {
          ...purchase.user,
          createdAt: purchase.user.createdAt.toISOString(),
        }
      : null,
    items: purchase.items.map((item) => ({
      ...item,
      product: item.product
        ? {
            ...item.product,
            createdAt: item.product.createdAt.toISOString(),
            updatedAt: item.product.updatedAt.toISOString(),
          }
        : null,
    })),
  }));

  return (
    <main className={styles.main}>
      <div className={styles.toolbar}>
        <div>
          <p className={styles.eyebrow}>Dashboard</p>
          <h1 className={styles.title}>Admin of Full Stack Blog</h1>
        </div>
        <div className={styles.actions}>
          <Link className={styles.secondaryButton} href="/posts/create">
            Create Post
          </Link>
          <LogoutButton />
        </div>
      </div>

      <AdminStoreDashboard
        categories={categories}
        initialProducts={productViews}
        initialPurchases={purchaseViews}
      />

      <AdminList posts={posts} />
    </main>
  );
}
