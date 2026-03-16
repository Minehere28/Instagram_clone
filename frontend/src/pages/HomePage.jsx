import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { getPosts } from "../services/postService";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadFeed() {
      setError("");
      try {
        const data = await getPosts();
        if (mounted) {
          setPosts(data);
        }
      } catch (_error) {
        if (mounted) {
          setPosts([]);
          setError("Failed to load feed. Please try again.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadFeed();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="feed-page">
      <Navbar />
      <main className="feed-container">
        {loading ? (
          <div className="loading-wrap" role="status" aria-live="polite">
            <div className="spinner" />
            <p>Loading feed...</p>
          </div>
        ) : null}

        {!loading && error ? <p className="feed-error">{error}</p> : null}

        {!loading && !error && !posts.length ? (
          <div className="empty-state">
            <h3>No posts yet</h3>
            <p>Follow users or create your first post to populate the feed.</p>
          </div>
        ) : null}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>
    </div>
  );
}

export default HomePage;
