import { useEffect, useMemo, useState } from "react";

import { createPost } from "../services/postService";

function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const [imageFiles, setImageFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewUrls = useMemo(() => {
    return imageFiles.map((file) => URL.createObjectURL(file));
  }, [imageFiles]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    if (!isOpen) {
      setImageFiles([]);
      setCaption("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!imageFiles.length) {
      setError("Please select at least one image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      imageFiles.forEach((file) => {
        formData.append("uploaded_images", file);
      });

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
            multiple
            onChange={(event) => setImageFiles(Array.from(event.target.files || []))}
            disabled={loading}
          />

          {previewUrls.length ? (
            <div className="preview-grid">
              {previewUrls.map((url, idx) => (
                <div className="preview-wrap" key={`${url}-${idx}`}>
                  <img src={url} alt={`Selected preview ${idx + 1}`} className="preview-image" />
                </div>
              ))}
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
