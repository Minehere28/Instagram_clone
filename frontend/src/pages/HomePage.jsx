import { useCallback, useEffect, useRef, useState } from "react";

import InfiniteLoader from "../components/InfiniteLoader";

import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import api from "../services/api";

const SkeletonFeed = () => {
  return (
    <>
      {[1, 2, 3].map((n) => (
        <div className="skeleton-post-card" key={n}>
          <div className="skeleton-post-header">
            <div className="skeleton skeleton-circle skeleton-post-avatar"></div>
            <div className="skeleton-post-meta">
              <div className="skeleton skeleton-post-username"></div>
              <div className="skeleton skeleton-post-time"></div>
            </div>
          </div>
          <div className="skeleton skeleton-post-image"></div>
          <div className="skeleton-post-actions">
            <div className="skeleton skeleton-post-action"></div>
            <div className="skeleton skeleton-post-action"></div>
          </div>
          <div className="skeleton skeleton-post-caption"></div>
          <div className="skeleton skeleton-post-caption" style={{ width: "60%" }}></div>
        </div>
      ))}
    </>
  );
};

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const inFlightRef = useRef(false);

  const loadPostsPage = useCallback(
    async (targetPage) => {
      if (inFlightRef.current) return;

      inFlightRef.current = true;
      setLoading(true);
      setError("");
      try {
        const response = await api.get("posts/", { params: { page: targetPage } });
        const payload = response.data?.data || response.data;
        const newPosts = Array.isArray(payload?.results)
          ? payload.results
          : Array.isArray(payload)
            ? payload
            : [];

        setPosts((prev) => (targetPage === 1 ? newPosts : [...prev, ...newPosts]));
        setHasMore(Boolean(payload?.next));
      } catch (_error) {
        setError("Failed to load feed. Please try again.");
        setHasMore(false);
        if (targetPage === 1) {
          setPosts([]);
        }
      } finally {
        setLoading(false);
        inFlightRef.current = false;
        if (targetPage === 1) {
          setLoadingInitial(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    loadPostsPage(1);
  }, [loadPostsPage]);

  const handleLoadMore = useCallback(() => {
    if (inFlightRef.current || loading || !hasMore || error) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadPostsPage(nextPage);
  }, [error, hasMore, loadPostsPage, loading, page]);

  return (
    <div className="feed-page">
      <Navbar onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])} />
      <main className="feed-container">
        {loadingInitial ? (
          <div role="status" aria-live="polite">
            <SkeletonFeed />
          </div>
        ) : null}

        {!loadingInitial && error ? <p className="feed-error">{error}</p> : null}

        {!loadingInitial && !error && !posts.length ? (
          <div className="empty-state">
            <h3>No posts yet</h3>
            <p>Follow users or create your first post to populate the feed.</p>
          </div>
        ) : null}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {!loadingInitial && !error ? (
          <>
            <InfiniteLoader hasMore={hasMore} loading={loading} onLoadMore={handleLoadMore} />
            {loading && hasMore ? (
              <div className="loading-wrap" role="status" aria-live="polite">
                <div className="spinner" />
                <p>Loading more posts...</p>
              </div>
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  );
}

export default HomePage;
