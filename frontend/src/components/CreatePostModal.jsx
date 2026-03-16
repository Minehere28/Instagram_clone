import { useEffect, useMemo, useState } from "react";

import { createPost } from "../services/postService";

function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!isOpen) {
      setImageFile(null);
      setCaption("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!imageFile) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("caption", caption);

      const newPost = await createPost(formData);
      onPostCreated?.(newPost);
      onClose();
    } catch (_err) {
      setError("Upload failed. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Create post">
      <div className="create-modal">
        <header className="create-modal-header">
          <h3>Create new post</h3>
          <button type="button" onClick={onClose} className="modal-close-btn" disabled={loading}>
            ×
          </button>
        </header>

        <form className="create-post-form" onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(event) => setImageFile(event.target.files?.[0] || null)}
            disabled={loading}
          />

          {previewUrl ? (
            <div className="preview-wrap">
              <img src={previewUrl} alt="Selected preview" className="preview-image" />
            </div>
          ) : null}

          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Write a caption..."
            rows={4}
            disabled={loading}
          />

          {error ? <p className="modal-error">{error}</p> : null}

          <button type="submit" className="modal-submit-btn" disabled={loading}>
            {loading ? "Uploading..." : "Share"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
