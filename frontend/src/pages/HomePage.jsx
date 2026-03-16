import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { getPosts } from "../services/postService";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadFeed() {
      try {
        const data = await getPosts();
        if (mounted) {
          setPosts(data);
        }
      } catch (_error) {
        if (mounted) {
          setPosts([]);
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
        {loading ? <p>Loading feed...</p> : null}
        {!loading && !posts.length ? <p>No posts yet.</p> : null}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>
    </div>
  );
}

export default HomePage;
