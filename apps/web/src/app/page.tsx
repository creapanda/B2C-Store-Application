import { getActiveProducts } from "@repo/db/client";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";

export default async function Home() {
  const products = await getActiveProducts();

  return (
    <AppLayout>
      <Main products={products} className={styles.main} />
    </AppLayout>
  );
}
