"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type {
  ProductCategory,
  StoreProduct,
  StorePurchase,
  StoreUser,
} from "@repo/db/client";

export type StoreProductView = Omit<StoreProduct, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type StoreUserView = Omit<StoreUser, "createdAt"> & {
  createdAt: string;
};

type StorePurchaseView = Omit<StorePurchase, "createdAt" | "user" | "items"> & {
  createdAt: string;
  user: StoreUserView | null;
  items: Array<
    Omit<StorePurchase["items"][number], "product"> & {
      product: StoreProductView | null;
    }
  >;
};

type CartItem = {
  productId: number;
  quantity: number;
};

type AuthMode = "login" | "register";

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
  }).format(new Date(value));
}

export function StoreFront({
  categories,
  initialProducts,
  initialUser,
}: {
  categories: ProductCategory[];
  initialProducts: StoreProductView[];
  initialUser: StoreUserView | null;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState(initialUser);
  const [history, setHistory] = useState<StorePurchaseView[]>([]);
  const [status, setStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const productsById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.slug === selectedCategory;
      const matchesSearch =
        !searchTerm || product.name.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch && product.active;
    });
  }, [products, query, selectedCategory]);

  const cartProducts = cartItems
    .map((item) => {
      const product = productsById.get(item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is CartItem & { product: StoreProductView } =>
      Boolean(item),
    );

  const cartTotal = cartProducts.reduce(
    (total, item) => total + item.product.priceCents * item.quantity,
    0,
  );
  const cartCount = cartProducts.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  async function loadHistory() {
    const response = await fetch("/api/purchases");

    if (response.ok) {
      setHistory((await response.json()) as StorePurchaseView[]);
    }
  }

  useEffect(() => {
    if (user) {
      void loadHistory();
    } else {
      setHistory([]);
    }
  }, [user]);

  function addToCart(product: StoreProductView) {
    if (product.stockQuantity <= 0) {
      return;
    }

    setCartItems((current) => {
      const existing = current.find((item) => item.productId === product.id);

      if (!existing) {
        return [...current, { productId: product.id, quantity: 1 }];
      }

      return current.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, product.stockQuantity),
            }
          : item,
      );
    });
    setStatus(`${product.name} added to cart`);
  }

  function setCartQuantity(productId: number, quantity: number) {
    const product = productsById.get(productId);

    if (!product) {
      return;
    }

    const nextQuantity = Math.max(0, Math.min(quantity, product.stockQuantity));

    setCartItems((current) => {
      if (nextQuantity === 0) {
        return current.filter((item) => item.productId !== productId);
      }

      return current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: nextQuantity }
          : item,
      );
    });
  }

  async function submitAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setStatus("");

    const endpoint =
      authMode === "login" ? "/api/auth/login" : "/api/auth/register";

    const response = await fetch(endpoint, {
      body: JSON.stringify(authForm),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const body = (await response.json()) as {
      user?: StoreUserView;
      error?: string;
    };

    setIsBusy(false);

    if (!response.ok || !body.user) {
      setStatus(body.error ?? "Sign in failed");
      return;
    }

    setUser(body.user);
    setAuthForm({ name: "", email: "", password: "" });
    setStatus(`Signed in as ${body.user.name}`);
  }

  async function logout() {
    setIsBusy(true);
    await fetch("/api/auth/logout", { method: "DELETE" });
    setUser(null);
    setIsBusy(false);
    setStatus("Signed out");
  }

  async function checkout() {
    if (!user) {
      setStatus("Sign in or create an account before checkout");
      return;
    }

    if (cartItems.length === 0) {
      setStatus("Your cart is empty");
      return;
    }

    setIsBusy(true);
    setStatus("Processing mock payment");

    const response = await fetch("/api/purchases", {
      body: JSON.stringify({ items: cartItems }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const body = (await response.json()) as {
      error?: string;
      items?: StorePurchaseView["items"];
    };

    setIsBusy(false);

    if (!response.ok || !body.items) {
      setStatus(body.error ?? "Checkout failed");
      return;
    }

    setProducts((current) =>
      current.map((product) => {
        const purchased = cartItems.find(
          (item) => item.productId === product.id,
        );

        if (!purchased) {
          return product;
        }

        return {
          ...product,
          stockQuantity: Math.max(
            0,
            product.stockQuantity - purchased.quantity,
          ),
        };
      }),
    );
    setCartItems([]);
    setStatus("Mock payment accepted");
    await loadHistory();
  }

  return (
    <section
      aria-labelledby="store-heading"
      className="mb-12 border-b border-gray-200 pb-10 dark:border-gray-700"
      data-test-id="store-front"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-wsu text-sm font-semibold">Store</p>
          <h1
            id="store-heading"
            className="text-primary mt-1 text-3xl font-bold tracking-normal"
          >
            B2C Store
          </h1>
        </div>
        <div className="text-secondary flex flex-wrap items-center gap-3 text-sm">
          <span>{products.length} products</span>
          <span>{cartCount} in cart</span>
          <span>{formatMoney(cartTotal)}</span>
        </div>
      </div>

      <div className="mb-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <label className="block">
          <span className="sr-only">Search products</span>
          <input
            aria-label="Search products"
            className="text-primary w-full rounded-md border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-gray-500"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Product name"
            type="search"
            value={query}
          />
        </label>
        <div
          aria-label="Product categories"
          className="flex flex-wrap gap-2"
          role="group"
        >
          <button
            className={`rounded-md border px-3 py-2 text-sm font-medium ${
              selectedCategory === "all"
                ? "border-wsu bg-wsu text-white"
                : "text-primary border-gray-300 hover:border-gray-500"
            }`}
            onClick={() => setSelectedCategory("all")}
            type="button"
          >
            All
          </button>
          {categories.map((category) => (
            <button
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                selectedCategory === category.slug
                  ? "border-wsu bg-wsu text-white"
                  : "text-primary border-gray-300 hover:border-gray-500"
              }`}
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
              data-test-id={`store-product-${product.id}`}
              key={product.id}
            >
              <img
                alt={product.name}
                className="h-44 w-full object-cover"
                src={product.imageUrl}
              />
              <div className="space-y-4 p-4">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-primary text-lg font-semibold leading-6">
                      {product.name}
                    </h2>
                    <span className="text-wsu shrink-0 text-sm font-semibold">
                      {formatMoney(product.priceCents)}
                    </span>
                  </div>
                  <p className="text-secondary min-h-12 text-sm leading-6">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-secondary text-sm">
                    {product.category?.name ?? "Uncategorised"} -{" "}
                    {product.stockQuantity} left
                  </span>
                  <button
                    aria-label={`Add ${product.name} to cart`}
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-gray-900 px-3 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
                    disabled={product.stockQuantity === 0}
                    onClick={() => addToCart(product)}
                    type="button"
                  >
                    <ShoppingBagIcon aria-hidden="true" className="h-5 w-5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 ? (
            <div className="text-secondary rounded-lg border border-gray-200 p-5 text-sm dark:border-gray-700">
              No products match this search.
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <section
            aria-labelledby="cart-heading"
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="cart-heading"
                className="text-primary text-lg font-semibold"
              >
                Cart
              </h2>
              <span className="text-secondary text-sm">
                {formatMoney(cartTotal)}
              </span>
            </div>

            <div className="space-y-3">
              {cartProducts.map((item) => (
                <div
                  className="grid grid-cols-[1fr_auto] gap-3 border-b border-gray-100 pb-3 last:border-b-0 dark:border-gray-800"
                  key={item.productId}
                >
                  <div>
                    <div className="text-primary text-sm font-medium">
                      {item.product.name}
                    </div>
                    <div className="text-secondary text-sm">
                      {formatMoney(item.product.priceCents)} each
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      aria-label={`Remove one ${item.product.name}`}
                      className="text-primary grid h-8 w-8 place-items-center rounded-md border border-gray-300 hover:border-gray-500"
                      onClick={() =>
                        setCartQuantity(item.productId, item.quantity - 1)
                      }
                      type="button"
                    >
                      <MinusIcon aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <span className="text-primary grid h-8 min-w-8 place-items-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      aria-label={`Add one ${item.product.name}`}
                      className="text-primary grid h-8 w-8 place-items-center rounded-md border border-gray-300 hover:border-gray-500"
                      onClick={() =>
                        setCartQuantity(item.productId, item.quantity + 1)
                      }
                      type="button"
                    >
                      <PlusIcon aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <button
                      aria-label={`Remove ${item.product.name} from cart`}
                      className="text-primary grid h-8 w-8 place-items-center rounded-md border border-gray-300 hover:border-gray-500"
                      onClick={() => setCartQuantity(item.productId, 0)}
                      type="button"
                    >
                      <TrashIcon aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {cartProducts.length === 0 ? (
                <p className="text-secondary text-sm">Your cart is empty.</p>
              ) : null}
            </div>

            <button
              className="bg-wsu hover:bg-wsu-light mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
              disabled={isBusy || cartProducts.length === 0}
              onClick={checkout}
              type="button"
            >
              {isBusy ? (
                <ArrowPathIcon
                  aria-hidden="true"
                  className="h-5 w-5 animate-spin"
                />
              ) : (
                <CheckCircleIcon aria-hidden="true" className="h-5 w-5" />
              )}
              Pay with mock checkout
            </button>
          </section>

          <section
            aria-labelledby="account-heading"
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <h2
              id="account-heading"
              className="text-primary mb-4 text-lg font-semibold"
            >
              Account
            </h2>

            {user ? (
              <div className="space-y-3">
                <div>
                  <div className="text-primary text-sm font-medium">
                    {user.name}
                  </div>
                  <div className="text-secondary text-sm">{user.email}</div>
                </div>
                <button
                  className="text-primary h-10 rounded-md border border-gray-300 px-3 text-sm font-medium hover:border-gray-500"
                  disabled={isBusy}
                  onClick={logout}
                  type="button"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={submitAuth}>
                <div className="grid grid-cols-2 rounded-md border border-gray-300 p-1">
                  <button
                    className={`h-9 rounded text-sm font-medium ${
                      authMode === "login"
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                        : "text-primary"
                    }`}
                    onClick={() => setAuthMode("login")}
                    type="button"
                  >
                    Login
                  </button>
                  <button
                    className={`h-9 rounded text-sm font-medium ${
                      authMode === "register"
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                        : "text-primary"
                    }`}
                    onClick={() => setAuthMode("register")}
                    type="button"
                  >
                    Register
                  </button>
                </div>

                {authMode === "register" ? (
                  <label className="block">
                    <span className="text-primary mb-1 block text-sm font-medium">
                      Name
                    </span>
                    <input
                      className="text-primary w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-gray-500"
                      onChange={(event) =>
                        setAuthForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      value={authForm.name}
                    />
                  </label>
                ) : null}

                <label className="block">
                  <span className="text-primary mb-1 block text-sm font-medium">
                    Email
                  </span>
                  <input
                    className="text-primary w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-gray-500"
                    onChange={(event) =>
                      setAuthForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    type="email"
                    value={authForm.email}
                  />
                </label>

                <label className="block">
                  <span className="text-primary mb-1 block text-sm font-medium">
                    Password
                  </span>
                  <input
                    className="text-primary w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-gray-500"
                    onChange={(event) =>
                      setAuthForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    type="password"
                    value={authForm.password}
                  />
                </label>

                <button
                  className="h-10 w-full rounded-md bg-gray-900 px-3 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
                  disabled={isBusy}
                  type="submit"
                >
                  {authMode === "login" ? "Login" : "Create account"}
                </button>
              </form>
            )}
          </section>

          {history.length > 0 ? (
            <section
              aria-labelledby="history-heading"
              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <h2
                id="history-heading"
                className="text-primary mb-4 text-lg font-semibold"
              >
                Purchase History
              </h2>
              <div className="space-y-3">
                {history.slice(0, 3).map((purchase) => (
                  <div
                    className="border-b border-gray-100 pb-3 text-sm last:border-b-0 dark:border-gray-800"
                    key={purchase.id}
                  >
                    <div className="text-primary flex items-center justify-between gap-3 font-medium">
                      <span>{formatDate(purchase.createdAt)}</span>
                      <span>{formatMoney(purchase.totalCents)}</span>
                    </div>
                    <div className="text-secondary mt-1">
                      {purchase.items
                        .map(
                          (item) =>
                            `${item.quantity} x ${
                              item.product?.name ?? "Product"
                            }`,
                        )
                        .join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {status ? (
            <div
              aria-live="polite"
              className="text-primary rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              {status}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
