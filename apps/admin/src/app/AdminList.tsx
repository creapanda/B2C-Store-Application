"use client";

import Link from "next/link";
import { useState } from "react";
import type { Post } from "@repo/db/data";
import styles from "./page.module.css";

type VisibilityFilter = "all" | "active" | "inactive";
type SortBy = "date-desc" | "date-asc" | "title-asc" | "title-desc";

function parseDateFilter(value: string) {
  const digitsOnly = value.replace(/\D/g, "");

  if (digitsOnly.length !== 8) {
    return null;
  }

  const day = Number(digitsOnly.slice(0, 2));
  const month = Number(digitsOnly.slice(2, 4));
  const year = Number(digitsOnly.slice(4, 8));

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    day <= 0 ||
    month <= 0
  ) {
    return null;
  }

  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function formatAdminDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => `#${tag.trim()}`)
    .join(", ");
}

function sortPosts(posts: Post[], sortBy: SortBy) {
  const sorted = [...posts];

  sorted.sort((a, b) => {
    if (sortBy === "title-asc") {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === "title-desc") {
      return b.title.localeCompare(a.title);
    }

    if (sortBy === "date-asc") {
      return a.date.getTime() - b.date.getTime();
    }

    return b.date.getTime() - a.date.getTime();
  });

  return sorted;
}

export function AdminList({ posts }: { posts: Post[] }) {
  const [contentFilter, setContentFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date-desc");
  const [items, setItems] = useState(posts);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const parsedDate = parseDateFilter(dateFilter);

  async function toggleActive(post: Post) {
    setLoadingId(post.urlId);

    try {
      const response = await fetch(`/api/posts/${post.urlId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !post.active }),
      });

      if (!response.ok) {
        return;
      }

      const updatedPost = await response.json();
      setItems((current) =>
        current.map((item) =>
          item.urlId === post.urlId ? { ...item, active: updatedPost.active } : item,
        ),
      );
    } finally {
      setLoadingId(null);
    }
  }

  const filteredPosts = sortPosts(
    items.filter((post) => {
      const matchesContent =
        contentFilter.trim() === "" ||
        post.title.toLowerCase().includes(contentFilter.toLowerCase()) ||
        post.content.toLowerCase().includes(contentFilter.toLowerCase());

      const matchesTag =
        tagFilter.trim() === "" ||
        post.tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .some((tag) => tag.includes(tagFilter.trim().toLowerCase()));

      const matchesDate =
        !parsedDate || post.date.getTime() >= parsedDate.getTime();

      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "active" && post.active) ||
        (visibilityFilter === "inactive" && !post.active);

      return (
        matchesContent && matchesTag && matchesDate && matchesVisibility
      );
    }),
    sortBy,
  );

  return (
    <>
      <section className={styles.filters}>
        <label className={styles.field}>
          <span>Filter by Content:</span>
          <input
            className={styles.input}
            onChange={(event) => setContentFilter(event.target.value)}
            type="text"
            value={contentFilter}
          />
        </label>

        <label className={styles.field}>
          <span>Filter by Tag:</span>
          <input
            className={styles.input}
            onChange={(event) => setTagFilter(event.target.value)}
            type="text"
            value={tagFilter}
          />
        </label>

        <label className={styles.field}>
          <span>Filter by Date Created:</span>
          <input
            className={styles.input}
            inputMode="numeric"
            onChange={(event) => setDateFilter(event.target.value)}
            placeholder="DDMMYYYY"
            type="text"
            value={dateFilter}
          />
        </label>

        <label className={styles.field}>
          <span>Filter by Visibility:</span>
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
          <span>Sort By:</span>
          <select
            className={styles.input}
            onChange={(event) => setSortBy(event.target.value as SortBy)}
            value={sortBy}
          >
            <option value="date-desc">Date Desc</option>
            <option value="date-asc">Date Asc</option>
            <option value="title-asc">Title Asc</option>
            <option value="title-desc">Title Desc</option>
          </select>
        </label>
      </section>

      <section className={styles.list}>
        {filteredPosts.map((post) => (
          <article className={styles.article} key={post.id}>
            <img
              alt={post.title}
              className={styles.articleImage}
              src={post.imageUrl}
            />
            <div className={styles.articleBody}>
              <Link className={styles.articleTitle} href={`/post/${post.urlId}`}>
                {post.title}
              </Link>
              <p>{formatTags(post.tags)}</p>
              <p>Posted on {formatAdminDate(post.date)}</p>
              <p>{post.category}</p>
              <button
                className={styles.statusButton}
                disabled={loadingId === post.urlId}
                type="button"
                onClick={() => toggleActive(post)}
              >
                {post.active ? "Active" : "Inactive"}
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
