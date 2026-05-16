"use client";

import { useEffect, useRef, useState } from "react";
import type { Post } from "@repo/db/data";
import { marked } from "marked";
import { toUrlPath } from "@repo/utils/url";
import styles from "./page.module.css";

type FormValues = {
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function createInitialValues(post?: Post): FormValues {
  return {
    title: post?.title ?? "",
    category: post?.category ?? "",
    description: post?.description ?? "",
    content: post?.content ?? "",
    imageUrl: post?.imageUrl ?? "",
    tags: post?.tags ?? "",
  };
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required";
  } else if (values.description.length > 200) {
    errors.description = "Description is too long. Maximum is 200 characters";
  }

  if (!values.content.trim()) {
    errors.content = "Content is required";
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

  if (!values.tags.trim()) {
    errors.tags = "At least one tag is required";
  }

  return errors;
}

export function AdminPostForm({
  post,
  mode,
}: {
  post?: Post;
  mode: "create" | "update";
}) {
  const [values, setValues] = useState<FormValues>(() => createInitialValues(post));
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [showSaveError, setShowSaveError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const selectionRef = useRef({ start: 0, end: 0 });

  useEffect(() => {
    if (!showPreview && contentRef.current) {
      const textarea = contentRef.current;
      textarea.focus();
      textarea.setSelectionRange(selectionRef.current.start, selectionRef.current.end);
    }
  }, [showPreview]);

  async function togglePreview() {
    if (!showPreview) {
      if (contentRef.current) {
        selectionRef.current = {
          start: contentRef.current.selectionStart,
          end: contentRef.current.selectionEnd,
        };
      }

      setPreviewHtml(await marked.parse(values.content));
      setShowPreview(true);
      return;
    }

    setShowPreview(false);
  }

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

    const urlId = post?.urlId ?? toUrlPath(values.title);
    const endpoint = mode === "create" ? "/api/posts" : `/api/posts/${post?.urlId}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urlId,
          title: values.title,
          category: values.category,
          description: values.description,
          content: values.content,
          imageUrl: values.imageUrl,
          tags: values.tags,
          active: post?.active ?? true,
          date: post?.date.toISOString() ?? new Date().toISOString(),
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
            <p className={styles.eyebrow}>Editor</p>
            <h1 className={styles.title}>
              {mode === "create" ? "Create Post" : "Modify Post"}
            </h1>
          </div>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span>Title</span>
            <input
              className={styles.input}
              onChange={(event) => updateValue("title", event.target.value)}
              type="text"
              value={values.title}
            />
            {errors.title ? <p className={styles.errorText}>{errors.title}</p> : null}
          </label>

          <label className={styles.field}>
            <span>Category</span>
            <input
              className={styles.input}
              onChange={(event) => updateValue("category", event.target.value)}
              type="text"
              value={values.category}
            />
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

          <div className={styles.field}>
            <div className={styles.previewHeader}>
              <span>Content</span>
              <button
                className={styles.previewButton}
                onClick={togglePreview}
                type="button"
              >
                {showPreview ? "Close Preview" : "Preview"}
              </button>
            </div>

            {showPreview ? (
              <div
                className={styles.previewBox}
                data-test-id="content-preview"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <textarea
                aria-label="Content"
                className={styles.textarea}
                onChange={(event) => updateValue("content", event.target.value)}
                ref={contentRef}
                rows={10}
                value={values.content}
              />
            )}
            {errors.content ? <p className={styles.errorText}>{errors.content}</p> : null}
          </div>

          <label className={styles.field}>
            <span>Image URL</span>
            <input
              className={styles.input}
              onChange={(event) => updateValue("imageUrl", event.target.value)}
              type="text"
              value={values.imageUrl}
            />
            {errors.imageUrl ? <p className={styles.errorText}>{errors.imageUrl}</p> : null}
          </label>

          <img
            alt="Preview"
            className={styles.imagePreview}
            data-test-id="image-preview"
            src={values.imageUrl || "about:blank"}
          />

          <label className={styles.field}>
            <span>Tags</span>
            <input
              className={styles.input}
              onChange={(event) => updateValue("tags", event.target.value)}
              type="text"
              value={values.tags}
            />
            {errors.tags ? <p className={styles.errorText}>{errors.tags}</p> : null}
          </label>
        </div>

        {showSaveError ? (
          <p className={styles.errorBanner}>Please fix the errors before saving</p>
        ) : null}

        {showSuccessMessage ? (
          <p className={styles.successBanner}>Post updated successfully</p>
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
