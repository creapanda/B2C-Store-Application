"use client";

import { useEffect, useState } from "react";

export function LikeButton({
  urlId,
  initialLikes,
}: {
  urlId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLikeState() {
      try {
        const response = await fetch(`/api/likes?urlId=${encodeURIComponent(urlId)}`);
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setLikes(data.likes ?? initialLikes);
        setLiked(Boolean(data.liked));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLikeState();
  }, [urlId, initialLikes]);

  async function handleToggle() {
    setLoading(true);

    try {
      const method = liked ? "DELETE" : "POST";
      const response = await fetch("/api/likes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urlId }),
      });

      if (!response.ok) {
        console.error("Failed to update like status");
        return;
      }

      const data = await response.json();
      setLikes(data.likes ?? likes);
      setLiked(Boolean(data.liked));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-primary transition hover:border-primary hover:text-primaryHover disabled:cursor-not-allowed disabled:opacity-60"
        data-test-id="like-button"
        disabled={loading}
        type="button"
        onClick={handleToggle}
      >
        {liked ? "Unlike" : "Like"}
      </button>
      <span>{likes} likes</span>
    </div>
  );
}
