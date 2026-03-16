import { useNavigate } from "react-router-dom";

function PostGrid({ posts }) {
  const navigate = useNavigate();

  if (!posts?.length) {
    return <p className="empty-state-text">No posts to display.</p>;
  }

  return (
    <div className="post-grid">
      {posts.map((post) => {
        const image = post.images?.[0]?.image?.url || post.images?.[0]?.image_url;
        return (
          <button
            type="button"
            key={post.id}
            className="grid-item"
            onClick={() => navigate(`/post/${post.id}`)}
          >
            {image ? <img src={image} alt={`Post ${post.id}`} /> : <div className="grid-placeholder" />}
          </button>
        );
      })}
    </div>
  );
}

export default PostGrid;
