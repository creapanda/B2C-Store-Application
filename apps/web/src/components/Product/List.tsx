"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product, PurchaseRecord } from "@repo/db/data";

type CartItem = {
  productId: number;
  quantity: number;
};

type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: string;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function getFormValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function ProductList({
  products,
  title = "Storefront",
  description,
}: {
  products: Product[];
  title?: string;
  description?: string;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );
  const cartTotal = cart.reduce((total, item) => {
    const product = productById.get(item.productId);
    return total + (product?.price ?? 0) * item.quantity;
  }, 0);

  async function loadUser() {
    const response = await fetch("/api/store/auth/me");

    if (!response.ok) {
      setUser(null);
      return;
    }

    setUser(await response.json());
  }

  async function loadPurchases() {
    const response = await fetch("/api/store/purchases");

    if (response.ok) {
      setPurchases(await response.json());
    }
  }

  useEffect(() => {
    void loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      void loadPurchases();
    } else {
      setPurchases([]);
    }
  }, [user]);

  function addToCart(product: Product) {
    setMessage("");
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);

      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item,
        );
      }

      return [...current, { productId: product.id, quantity: 1 }];
    });
  }

  function updateQuantity(productId: number, quantity: number) {
    const product = productById.get(productId);
    const nextQuantity = Math.max(0, Math.min(quantity, product?.stock ?? 0));

    setCart((current) =>
      nextQuantity === 0
        ? current.filter((item) => item.productId !== productId)
        : current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: nextQuantity }
              : item,
          ),
    );
  }

  async function submitAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const endpoint =
      authMode === "login"
        ? "/api/store/auth/login"
        : "/api/store/auth/register";
    const body =
      authMode === "login"
        ? {
            email: getFormValue(formData, "email"),
            password: getFormValue(formData, "password"),
          }
        : {
            name: getFormValue(formData, "name"),
            email: getFormValue(formData, "email"),
            password: getFormValue(formData, "password"),
          };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error ?? "Unable to authenticate");
      return;
    }

    setUser(await response.json());
    setMessage(authMode === "login" ? "Signed in" : "Account created");
  }

  async function logout() {
    await fetch("/api/store/auth/logout", { method: "POST" });
    setUser(null);
    setCart([]);
    setMessage("Signed out");
  }

  async function checkout() {
    if (!user) {
      setMessage("Sign in or register before checkout");
      return;
    }

    if (cart.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    setIsCheckingOut(true);
    setMessage("");

    try {
      const response = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "Checkout failed");
        return;
      }

      setCart([]);
      setMessage(`Payment approved. Order ${data.paymentRef} created.`);
      await loadPurchases();
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-medium text-secondary">
          {products.length} Products
        </p>
        <h1 className="mt-2 text-3xl font-bold text-primary">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-secondary">
            {description}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article
              className="overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50"
              data-test-id={`product-${product.id}`}
              key={product.id}
            >
              <img
                alt={product.name}
                className="aspect-[4/3] w-full object-cover"
                src={product.imageUrl}
              />
              <div className="grid gap-3 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-secondary">
                    {product.category}
                  </p>
                  <h2 className="mt-1 text-lg font-bold">{product.name}</h2>
                </div>
                <p className="text-sm text-secondary">{product.description}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-bold">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-secondary">
                    {product.stock} in stock
                  </span>
                </div>
                <button
                  className="rounded-md bg-gray-950 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-gray-100 dark:text-gray-950"
                  disabled={product.stock === 0}
                  onClick={() => addToCart(product)}
                  type="button"
                >
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="grid content-start gap-4">
          <section className="rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Cart</h2>
                <p className="text-sm text-secondary">
                  Mock payment checkout
                </p>
              </div>
              <span className="text-sm font-semibold">{formatPrice(cartTotal)}</span>
            </div>

            <div className="mt-4 grid gap-3">
              {cart.length === 0 ? (
                <p className="text-sm text-secondary">No items in cart</p>
              ) : (
                cart.map((item) => {
                  const product = productById.get(item.productId);

                  if (!product) {
                    return null;
                  }

                  return (
                    <div
                      className="grid gap-2 border-t border-gray-200 pt-3 dark:border-gray-700"
                      key={item.productId}
                    >
                      <div className="flex justify-between gap-3 text-sm">
                        <span className="font-semibold">{product.name}</span>
                        <span>{formatPrice(product.price * item.quantity)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="h-8 w-8 rounded-md border border-gray-300"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          type="button"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          className="h-8 w-8 rounded-md border border-gray-300"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          type="button"
                        >
                          +
                        </button>
                        <button
                          className="ml-auto text-sm font-semibold text-secondary"
                          onClick={() => updateQuantity(item.productId, 0)}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              className="mt-4 w-full rounded-md bg-wsu px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              disabled={isCheckingOut}
              onClick={checkout}
              type="button"
            >
              {isCheckingOut ? "Processing..." : "Checkout"}
            </button>
          </section>

          <section className="rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50">
            {user ? (
              <div className="grid gap-3">
                <div>
                  <h2 className="text-lg font-bold">{user.name}</h2>
                  <p className="text-sm text-secondary">{user.email}</p>
                </div>
                <button
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold"
                  onClick={logout}
                  type="button"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <form className="grid gap-3" onSubmit={submitAuth}>
                <div>
                  <h2 className="text-lg font-bold">
                    {authMode === "login" ? "Sign in" : "Register"}
                  </h2>
                  <p className="text-sm text-secondary">
                    Use an account to save purchase history
                  </p>
                </div>
                {authMode === "register" ? (
                  <label className="grid gap-1 text-sm font-semibold">
                    <span>Name</span>
                    <input
                      className="rounded-md border border-gray-300 bg-transparent px-3 py-2"
                      name="name"
                      type="text"
                    />
                  </label>
                ) : null}
                <label className="grid gap-1 text-sm font-semibold">
                  <span>Email</span>
                  <input
                    className="rounded-md border border-gray-300 bg-transparent px-3 py-2"
                    name="email"
                    type="email"
                  />
                </label>
                <label className="grid gap-1 text-sm font-semibold">
                  <span>Password</span>
                  <input
                    className="rounded-md border border-gray-300 bg-transparent px-3 py-2"
                    name="password"
                    type="password"
                  />
                </label>
                <button
                  className="rounded-md bg-gray-950 px-3 py-2 text-sm font-semibold text-white dark:bg-gray-100 dark:text-gray-950"
                  type="submit"
                >
                  {authMode === "login" ? "Sign in" : "Create account"}
                </button>
                <button
                  className="text-left text-sm font-semibold text-secondary"
                  onClick={() =>
                    setAuthMode(authMode === "login" ? "register" : "login")
                  }
                  type="button"
                >
                  {authMode === "login"
                    ? "Create a new account"
                    : "I already have an account"}
                </button>
              </form>
            )}
          </section>

          {message ? (
            <p className="rounded-md border border-gray-200 bg-white p-3 text-sm font-semibold text-gray-950 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50">
              {message}
            </p>
          ) : null}

          {user ? (
            <section className="rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50">
              <h2 className="text-lg font-bold">Purchase history</h2>
              <div className="mt-3 grid gap-3">
                {purchases.length === 0 ? (
                  <p className="text-sm text-secondary">No purchases yet</p>
                ) : (
                  purchases.map((purchase) => (
                    <article
                      className="border-t border-gray-200 pt-3 text-sm dark:border-gray-700"
                      key={purchase.id}
                    >
                      <div className="flex justify-between gap-3 font-semibold">
                        <span>{purchase.paymentRef}</span>
                        <span>{formatPrice(purchase.totalAmount)}</span>
                      </div>
                      <p className="mt-1 text-secondary">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-secondary">
                        {purchase.items
                          .map((item) => `${item.quantity} x ${item.productName}`)
                          .join(", ")}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
