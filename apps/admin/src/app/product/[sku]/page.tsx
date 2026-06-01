import { getProductBySku } from "@repo/db/client";
import { AdminProductForm } from "../../AdminProductForm";
import { isLoggedIn } from "../../../utils/auth";
import { AdminSignIn } from "../../AdminSignIn";

export default async function Page({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return <AdminSignIn />;
  }

  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    return <main>Product not found</main>;
  }

  return <AdminProductForm mode="update" product={product} />;
}
