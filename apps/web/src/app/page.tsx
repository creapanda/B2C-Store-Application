import {
  getActivePosts,
  getProductCategories,
  getProducts,
} from "@repo/db/client";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import {
  StoreFront,
  type StoreProductView,
  type StoreUserView,
} from "../components/Store/StoreFront";
import { getCurrentStoreUser } from "../utils/storeAuth";
import styles from "./page.module.css";

export default async function Home() {
  const [activePosts, products, categories, currentUser] = await Promise.all([
    getActivePosts(),
    getProducts(),
    getProductCategories(),
    getCurrentStoreUser(),
  ]);

  const productViews: StoreProductView[] = products.map((product) => ({
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }));

  const userView: StoreUserView | null = currentUser
    ? {
        ...currentUser,
        createdAt: currentUser.createdAt.toISOString(),
      }
    : null;

  return (
    <AppLayout>
      <StoreFront
        categories={categories}
        initialProducts={productViews}
        initialUser={userView}
      />
      <Main posts={activePosts} className={styles.main} />
    </AppLayout>
  );
}
