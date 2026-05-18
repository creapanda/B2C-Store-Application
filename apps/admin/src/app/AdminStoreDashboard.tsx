"use client";

import { useMemo, useState } from "react";
import {
  ArchiveBoxIcon,
  ArrowPathIcon,
  CheckIcon,
  PencilSquareIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type {
  ProductCategory,
  StoreProduct,
  StorePurchase,
  StoreUser,
} from "@repo/db/client";
import styles from "./page.module.css";

export type AdminProductView = Omit<StoreProduct, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

type AdminUserView = Omit<StoreUser, "createdAt"> & {
  createdAt: string;
};

export type AdminPurchaseView = Omit<
  StorePurchase,
  "createdAt" | "user" | "items"
> & {
  createdAt: string;
  user: AdminUserView | null;
  items: Array<
    Omit<StorePurchase["items"][number], "product"> & {
      product: AdminProductView | null;
    }
  >;
};

type ProductFormState = {
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  stockQuantity: string;
  categorySlug: string;
  active: boolean;
};

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  imageUrl: "",
  price: "",
  stockQuantity: "",
  categorySlug: "",
  active: true,
};

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    currency: "AUD",
    style: "currency",
  }).format(cents / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formFromProduct(product: AdminProductView): ProductFormState {
  return {
    name: product.name,
    description: product.description,
    imageUrl: product.imageUrl,
    price: (product.priceCents / 100).toString(),
    stockQuantity: product.stockQuantity.toString(),
    categorySlug: product.category?.slug ?? "",
    active: product.active,
  };
}

function productPayload(form: ProductFormState) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    imageUrl: form.imageUrl.trim(),
    price: Number(form.price),
    stockQuantity: Number(form.stockQuantity),
    categorySlug: form.categorySlug,
    active: form.active,
  };
}

export function AdminStoreDashboard({
  categories,
  initialProducts,
  initialPurchases,
}: {
  categories: ProductCategory[];
  initialProducts: AdminProductView[];
  initialPurchases: AdminPurchaseView[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [purchases] = useState(initialPurchases);
  const [form, setForm] = useState<ProductFormState>({
    ...emptyForm,
    categorySlug: categories[0]?.slug ?? "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category?.name.toLowerCase().includes(term),
    );
  }, [products, search]);

  const productCount = products.length;
  const activeCount = products.filter((product) => product.active).length;
  const lowStockCount = products.filter(
    (product) => product.stockQuantity <= 5,
  ).length;
  const revenueCents = purchases.reduce(
    (total, purchase) => total + purchase.totalCents,
    0,
  );

  function updateForm<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm, categorySlug: categories[0]?.slug ?? "" });
  }

  function editProduct(product: AdminProductView) {
    setEditingId(product.id);
    setForm(formFromProduct(product));
    setStatus(`Editing ${product.name}`);
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.imageUrl.trim() ||
      !form.categorySlug ||
      Number.isNaN(Number(form.price)) ||
      Number(form.price) < 0 ||
      !Number.isInteger(Number(form.stockQuantity)) ||
      Number(form.stockQuantity) < 0
    ) {
      setStatus("Please complete every product field with valid values");
      return;
    }

    setIsSaving(true);
    setStatus("");

    const response = await fetch(
      editingId ? `/api/products/${editingId}` : "/api/products",
      {
        body: JSON.stringify(productPayload(form)),
        headers: {
          "Content-Type": "application/json",
        },
        method: editingId ? "PUT" : "POST",
      },
    );
    const body = (await response.json()) as AdminProductView & {
      error?: string;
    };
    setIsSaving(false);

    if (!response.ok) {
      setStatus(body.error ?? "Product could not be saved");
      return;
    }

    setProducts((current) =>
      editingId
        ? current.map((product) => (product.id === body.id ? body : product))
        : [...current, body],
    );
    setStatus(editingId ? "Product updated" : "Product created");
    resetForm();
  }

  async function archiveProduct(product: AdminProductView) {
    setLoadingId(product.id);
    setStatus("");

    const response = await fetch(`/api/products/${product.id}`, {
      method: "DELETE",
    });
    const body = (await response.json()) as AdminProductView & {
      error?: string;
    };
    setLoadingId(null);

    if (!response.ok) {
      setStatus(body.error ?? "Product could not be archived");
      return;
    }

    setProducts((current) =>
      current.map((item) => (item.id === body.id ? body : item)),
    );
    setStatus(`${body.name} archived`);
  }

  return (
    <section
      aria-labelledby="store-admin-heading"
      className={styles.storePanel}
      data-test-id="admin-store-dashboard"
    >
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.eyebrow}>Store Admin</p>
          <h2 id="store-admin-heading" className={styles.sectionTitle}>
            Products and Purchases
          </h2>
        </div>
        <div className={styles.metricGrid}>
          <div className={styles.metric}>
            <span>Products</span>
            <strong>{productCount}</strong>
          </div>
          <div className={styles.metric}>
            <span>Active</span>
            <strong>{activeCount}</strong>
          </div>
          <div className={styles.metric}>
            <span>Low Stock</span>
            <strong>{lowStockCount}</strong>
          </div>
          <div className={styles.metric}>
            <span>Revenue</span>
            <strong>{formatMoney(revenueCents)}</strong>
          </div>
        </div>
      </div>

      <div className={styles.storeGrid}>
        <form className={styles.productForm} onSubmit={saveProduct}>
          <div className={styles.formTitleRow}>
            <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
            {editingId ? (
              <button
                className={styles.iconButton}
                onClick={resetForm}
                title="Cancel editing"
                type="button"
              >
                <XMarkIcon aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <label className={styles.field}>
            <span>Product Name</span>
            <input
              className={styles.input}
              onChange={(event) => updateForm("name", event.target.value)}
              value={form.name}
            />
          </label>

          <label className={styles.field}>
            <span>Description</span>
            <textarea
              className={styles.textarea}
              onChange={(event) =>
                updateForm("description", event.target.value)
              }
              value={form.description}
            />
          </label>

          <label className={styles.field}>
            <span>Image URL</span>
            <input
              className={styles.input}
              onChange={(event) => updateForm("imageUrl", event.target.value)}
              value={form.imageUrl}
            />
          </label>

          <div className={styles.twoColumnFields}>
            <label className={styles.field}>
              <span>Price</span>
              <input
                className={styles.input}
                min="0"
                onChange={(event) => updateForm("price", event.target.value)}
                step="0.01"
                type="number"
                value={form.price}
              />
            </label>

            <label className={styles.field}>
              <span>Stock</span>
              <input
                className={styles.input}
                min="0"
                onChange={(event) =>
                  updateForm("stockQuantity", event.target.value)
                }
                step="1"
                type="number"
                value={form.stockQuantity}
              />
            </label>
          </div>

          <div className={styles.twoColumnFields}>
            <label className={styles.field}>
              <span>Category</span>
              <select
                className={styles.input}
                onChange={(event) =>
                  updateForm("categorySlug", event.target.value)
                }
                value={form.categorySlug}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.checkboxField}>
              <input
                checked={form.active}
                onChange={(event) => updateForm("active", event.target.checked)}
                type="checkbox"
              />
              <span>Visible in store</span>
            </label>
          </div>

          <button className={styles.button} disabled={isSaving} type="submit">
            {isSaving ? (
              <ArrowPathIcon aria-hidden="true" className={styles.buttonIcon} />
            ) : editingId ? (
              <CheckIcon aria-hidden="true" className={styles.buttonIcon} />
            ) : (
              <PlusIcon aria-hidden="true" className={styles.buttonIcon} />
            )}
            {editingId ? "Save Product" : "Create Product"}
          </button>
        </form>

        <div className={styles.productTablePanel}>
          <div className={styles.tableToolbar}>
            <h3>Inventory</h3>
            <label>
              <span className={styles.visuallyHidden}>Search products</span>
              <input
                className={styles.compactInput}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search inventory"
                value={search}
              />
            </label>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className={styles.productCell}>
                        <img alt={product.name} src={product.imageUrl} />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category?.name ?? "Uncategorised"}</td>
                    <td>{formatMoney(product.priceCents)}</td>
                    <td>{product.stockQuantity}</td>
                    <td>
                      <span
                        className={
                          product.active
                            ? styles.activeBadge
                            : styles.inactiveBadge
                        }
                      >
                        {product.active ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          className={styles.iconButton}
                          onClick={() => editProduct(product)}
                          title={`Edit ${product.name}`}
                          type="button"
                        >
                          <PencilSquareIcon aria-hidden="true" />
                        </button>
                        <button
                          className={styles.iconButton}
                          disabled={!product.active || loadingId === product.id}
                          onClick={() => archiveProduct(product)}
                          title={`Archive ${product.name}`}
                          type="button"
                        >
                          <ArchiveBoxIcon aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No products found.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <section aria-labelledby="purchase-records-heading">
        <div className={styles.tableToolbar}>
          <h3 id="purchase-records-heading">Purchase Records</h3>
          <span className={styles.tableMeta}>
            {purchases.length} purchase{purchases.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{formatDate(purchase.createdAt)}</td>
                  <td>
                    <div>
                      <strong>{purchase.user?.name ?? "Unknown"}</strong>
                      <span className={styles.subText}>
                        {purchase.user?.email ?? `User #${purchase.userId}`}
                      </span>
                    </div>
                  </td>
                  <td>
                    {purchase.items
                      .map(
                        (item) =>
                          `${item.quantity} x ${
                            item.product?.name ?? `Product #${item.productId}`
                          }`,
                      )
                      .join(", ")}
                  </td>
                  <td>{purchase.paymentReference}</td>
                  <td>{formatMoney(purchase.totalCents)}</td>
                </tr>
              ))}
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={5}>No purchase records yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {status ? (
        <p className={styles.statusMessage} role="status">
          {status}
        </p>
      ) : null}
    </section>
  );
}
