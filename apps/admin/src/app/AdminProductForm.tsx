"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@repo/db/data";
import styles from "./page.module.css";

type FormValues = {
  sku: string;
  name: string;
  category: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  active: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const productCategories = ["Keyboard", "Mouse", "Headset"];
const defaultCategory = "Keyboard";

function createInitialValues(product?: Product): FormValues {
  return {
    sku: product?.sku ?? "",
    name: product?.name ?? "",
    category: product?.category ?? defaultCategory,
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    stock: product ? String(product.stock) : "",
    imageUrl: product?.imageUrl ?? "",
    active: product?.active ?? true,
  };
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const price = Number(values.price);
  const stock = Number(values.stock);

  if (!values.sku.trim()) {
    errors.sku = "SKU is required";
  }

  if (!values.name.trim()) {
    errors.name = "Name is required";
  }

  if (!productCategories.includes(values.category)) {
    errors.category = "Select Keyboard, Mouse, or Headset";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required";
  }

  if (!Number.isFinite(price) || price < 0) {
    errors.price = "Price must be zero or greater";
  }

  if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock must be a whole number";
  }

  if (!values.imageUrl.trim()) {
    errors.imageUrl = "Image URL is required";
  } else {
    try {
      new URL(values.imageUrl);
    } catch {
      errors.imageUrl = "This is not a valid URL";
    }
  }

  return errors;
}

export function AdminProductForm({
  product,
  mode,
}: {
  product?: Product;
  mode: "create" | "update";
}) {
  const [values, setValues] = useState<FormValues>(() =>
    createInitialValues(product),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSaveError, setShowSaveError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function updateValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSave() {
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setShowSaveError(true);
      return;
    }

    setShowSaveError(false);
    setIsSaving(true);

    const endpoint = mode === "create" ? "/api/products" : `/api/products/${product?.sku}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: values.sku,
          name: values.name,
          category: values.category,
          description: values.description,
          price: Number(values.price),
          stock: Number(values.stock),
          imageUrl: values.imageUrl,
          active: values.active,
        }),
      });

      if (!response.ok) {
        setShowSaveError(true);
        return;
      }

      setShowSuccessMessage(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.formShell}>
        <div className={styles.toolbar}>
          <div>
            <p className={styles.eyebrow}>Inventory</p>
            <h1 className={styles.title}>
              {mode === "create" ? "Create Product" : "Modify Product"}
            </h1>
          </div>
          <Link className={styles.secondaryButton} href="/">
            Back
          </Link>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span>SKU</span>
            <input
              className={styles.input}
              onChange={(event) => updateValue("sku", event.target.value)}
              type="text"
              value={values.sku}
            />
            {errors.sku ? <p className={styles.errorText}>{errors.sku}</p> : null}
          </label>

          <label className={styles.field}>
            <span>Name</span>
            <input
              className={styles.input}
              onChange={(event) => updateValue("name", event.target.value)}
              type="text"
              value={values.name}
            />
            {errors.name ? <p className={styles.errorText}>{errors.name}</p> : null}
          </label>

          <label className={styles.field}>
            <span>Category</span>
            <select
              className={styles.input}
              onChange={(event) => updateValue("category", event.target.value)}
              value={values.category}
            >
              {productCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p className={styles.errorText}>{errors.category}</p>
            ) : null}
          </label>

          <label className={styles.field}>
            <span>Description</span>
            <textarea
              className={styles.textarea}
              onChange={(event) => updateValue("description", event.target.value)}
              rows={4}
              value={values.description}
            />
            {errors.description ? (
              <p className={styles.errorText}>{errors.description}</p>
            ) : null}
          </label>

          <label className={styles.field}>
            <span>Price</span>
            <input
              className={styles.input}
              min="0"
              onChange={(event) => updateValue("price", event.target.value)}
              step="0.01"
              type="number"
              value={values.price}
            />
            {errors.price ? <p className={styles.errorText}>{errors.price}</p> : null}
          </label>

          <label className={styles.field}>
            <span>Stock</span>
            <input
              className={styles.input}
              min="0"
              onChange={(event) => updateValue("stock", event.target.value)}
              step="1"
              type="number"
              value={values.stock}
            />
            {errors.stock ? <p className={styles.errorText}>{errors.stock}</p> : null}
          </label>

          <label className={styles.field}>
            <span>Image URL</span>
            <input
              className={styles.input}
              onChange={(event) => updateValue("imageUrl", event.target.value)}
              type="text"
              value={values.imageUrl}
            />
            {errors.imageUrl ? (
              <p className={styles.errorText}>{errors.imageUrl}</p>
            ) : null}
          </label>

          <img
            alt="Preview"
            className={styles.imagePreview}
            data-test-id="image-preview"
            src={values.imageUrl || "about:blank"}
          />

          <label className={styles.checkboxField}>
            <input
              checked={values.active}
              onChange={(event) => updateValue("active", event.target.checked)}
              type="checkbox"
            />
            <span>Active</span>
          </label>
        </div>

        {showSaveError ? (
          <p className={styles.errorBanner}>Please fix the errors before saving</p>
        ) : null}

        {showSuccessMessage ? (
          <p className={styles.successBanner}>Product saved successfully</p>
        ) : null}

        <div className={styles.formActions}>
          <button
            className={styles.button}
            disabled={isSaving}
            onClick={handleSave}
            type="button"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </main>
  );
}
