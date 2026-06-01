"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product, PurchaseRecord } from "@repo/db/data";
import styles from "./page.module.css";

type VisibilityFilter = "all" | "active" | "inactive";
type SortBy = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const productCategories = ["Keyboard", "Mouse", "Headset"];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function sortProducts(products: Product[], sortBy: SortBy) {
  const sorted = [...products];

  sorted.sort((a, b) => {
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return a.name.localeCompare(b.name);
  });

  return sorted;
}

export function AdminList({
  products,
  purchases,
}: {
  products: Product[];
  purchases: PurchaseRecord[];
}) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("name-asc");
  const [items, setItems] = useState(products);
  const [loadingSku, setLoadingSku] = useState<string | null>(null);

  async function toggleActive(product: Product) {
    setLoadingSku(product.sku);

    try {
      const response = await fetch(`/api/products/${product.sku}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, active: !product.active }),
      });

      if (!response.ok) return;

      const updatedProduct = await response.json();
      setItems((current) =>
        current.map((item) =>
          item.sku === product.sku ? { ...item, active: updatedProduct.active } : item,
        ),
      );
    } finally {
      setLoadingSku(null);
    }
  }

  const filteredProducts = sortProducts(
    items.filter((product) => {
      const matchesQuery =
        query.trim() === "" ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        categoryFilter.trim() === "" || product.category === categoryFilter;
      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "active" && product.active) ||
        (visibilityFilter === "inactive" && !product.active);

      return matchesQuery && matchesCategory && matchesVisibility;
    }),
    sortBy,
  );

  return (
    <div className={styles.dashboardGrid}>
      <section>
        <section className={styles.filters}>
          <label className={styles.field}>
            <span>Filter products</span>
            <input
              className={styles.input}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              value={query}
            />
          </label>

          <label className={styles.field}>
            <span>Filter by category</span>
            <select
              className={styles.input}
              onChange={(event) => setCategoryFilter(event.target.value)}
              value={categoryFilter}
            >
              <option value="">All categories</option>
              {productCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Filter by visibility</span>
            <select
              className={styles.input}
              onChange={(event) =>
                setVisibilityFilter(event.target.value as VisibilityFilter)
              }
              value={visibilityFilter}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Sort by</span>
            <select
              className={styles.input}
              onChange={(event) => setSortBy(event.target.value as SortBy)}
              value={sortBy}
            >
              <option value="name-asc">Name Asc</option>
              <option value="name-desc">Name Desc</option>
              <option value="price-asc">Price Asc</option>
              <option value="price-desc">Price Desc</option>
            </select>
          </label>
        </section>

        <section className={styles.list}>
          {filteredProducts.map((product) => (
            <article className={styles.article} key={product.id}>
              <img
                alt={product.name}
                className={styles.articleImage}
                src={product.imageUrl}
              />
              <div className={styles.articleBody}>
                <Link className={styles.articleTitle} href={`/product/${product.sku}`}>
                  {product.name}
                </Link>
                <p>{product.sku}</p>
                <p>{product.category}</p>
                <p>{formatPrice(product.price)} - {product.stock} in stock</p>
                <button
                  className={styles.statusButton}
                  disabled={loadingSku === product.sku}
                  type="button"
                  onClick={() => toggleActive(product)}
                >
                  {product.active ? "Active" : "Inactive"}
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>

      <section className={styles.purchasePanel}>
        <div>
          <p className={styles.eyebrow}>Orders</p>
          <h2 className={styles.sectionTitle}>Purchase Records</h2>
        </div>

        {purchases.length === 0 ? (
          <p className={styles.mutedText}>No purchase records yet.</p>
        ) : (
          <div className={styles.purchaseList}>
            {purchases.map((purchase) => (
              <article className={styles.purchaseCard} key={purchase.id}>
                <div className={styles.purchaseHeader}>
                  <div>
                    <h3>{purchase.paymentRef}</h3>
                    <p>{purchase.userName}</p>
                    <p>{purchase.userEmail}</p>
                  </div>
                  <strong>{formatPrice(purchase.totalAmount)}</strong>
                </div>
                <p className={styles.mutedText}>
                  {new Date(purchase.createdAt).toLocaleString()}
                </p>
                <ul className={styles.purchaseItems}>
                  {purchase.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity} x {item.productName} (
                      {formatPrice(item.unitPrice)})
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
