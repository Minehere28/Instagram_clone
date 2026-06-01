import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import FollowButton from "../components/FollowButton";
import Navbar from "../components/Navbar";
import PostGrid from "../components/PostGrid";
import { getCurrentUser } from "../services/authService";
import { getProfileByUsername } from "../services/userService";
import { uploadAvatar } from "../services/userService";

function ProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followerCount, setFollowerCount] = useState(0);
  const [initialFollowing, setInitialFollowing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [cropBaseScale, setCropBaseScale] = useState(1);
  const [cropState, setCropState] = useState({ x: 0, y: 0, scale: 1 });
  const [cropZoom, setCropZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const avatarInputRef = useRef(null);
  const cropperRef = useRef(null);
  const imageRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const data = await getProfileByUsername(username);
        if (mounted) {
          setProfileData(data);
          setFollowerCount(data.profile?.followers_count || 0);
          setInitialFollowing(Boolean(data.profile?.is_following));
        }
      } catch (_error) {
        if (mounted) {
          setError("Unable to load profile.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [username]);

  useEffect(() => {
    return () => {
      if (previewSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  const currentUser = getCurrentUser();
  const isOwnProfile = currentUser?.username === username;

  const resetAvatarPicker = () => {
    setSelectedFile(null);
    setPreviewSrc(null);
    setCropBaseScale(1);
    setCropState({ x: 0, y: 0, scale: 1 });
    setCropZoom(1);
    setImageReady(false);
    setAvatarError("");
    setDragging(false);
    dragRef.current = null;
    if (avatarInputRef.current) avatarInputRef.current.value = null;
  };

  const refreshProfile = async () => {
    const data = await getProfileByUsername(username);
    setProfileData(data);
    setFollowerCount(data.profile?.followers_count || 0);
    setInitialFollowing(Boolean(data.profile?.is_following));
  };

  const buildCroppedAvatarFile = async () => {
    const image = imageRef.current;
    const cropper = cropperRef.current;
    if (!image || !cropper) {
      throw new Error("Cropper is not ready.");
    }

    const outputSize = 512;
    const ratio = outputSize / cropper.clientWidth;
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas is not available.");
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outputSize, outputSize);

    const drawWidth = image.naturalWidth * cropState.scale * ratio;
    const drawHeight = image.naturalHeight * cropState.scale * ratio;
    const drawX = cropState.x * ratio;
    const drawY = cropState.y * ratio;

    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) {
      throw new Error("Failed to create cropped avatar.");
    }

    return new File([blob], `${selectedFile?.name?.replace(/\.[^.]+$/, "") || "avatar"}.jpg`, {
      type: "image/jpeg",
    });
  };

  const handleAvatarFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewSrc?.startsWith("blob:")) {
      URL.revokeObjectURL(previewSrc);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewSrc(objectUrl);
    setAvatarError("");
    setCropZoom(1);
    setCropBaseScale(1);
    setCropState({ x: 0, y: 0, scale: 1 });
    setImageReady(false);
  };

  const handleAvatarImageLoad = () => {
    const image = imageRef.current;
    const cropper = cropperRef.current;
    if (!image || !cropper) return;

    const boxSize = cropper.clientWidth;
    const baseScale = Math.max(boxSize / image.naturalWidth, boxSize / image.naturalHeight);
    const displayWidth = image.naturalWidth * baseScale;
    const displayHeight = image.naturalHeight * baseScale;

    setCropBaseScale(baseScale);
    setCropZoom(1);
    setCropState({
      x: (boxSize - displayWidth) / 2,
      y: (boxSize - displayHeight) / 2,
      scale: baseScale,
    });
    setImageReady(true);
  };

  const handleAvatarPointerDown = (event) => {
    if (!previewSrc || uploading) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: cropState.x,
      originY: cropState.y,
    };
    setDragging(true);
  };

  const handleAvatarPointerMove = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;

    setCropState((prev) => ({
      ...prev,
      x: dragRef.current.originX + deltaX,
      y: dragRef.current.originY + deltaY,
    }));
  };

  const handleAvatarPointerUp = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
  };

  const handleZoomChange = (event) => {
    const nextZoom = Number(event.target.value);
    const image = imageRef.current;
    if (!image || !cropperRef.current) return;

    setCropState((prev) => {
      const currentWidth = image.naturalWidth * prev.scale;
      const currentHeight = image.naturalHeight * prev.scale;
      const centerX = prev.x + currentWidth / 2;
      const centerY = prev.y + currentHeight / 2;
      const nextScale = cropBaseScale * nextZoom;
      const nextWidth = image.naturalWidth * nextScale;
      const nextHeight = image.naturalHeight * nextScale;

      return {
        x: centerX - nextWidth / 2,
        y: centerY - nextHeight / 2,
        scale: nextScale,
      };
    });

    setCropZoom(nextZoom);
  };

  const handleConfirmAvatarUpload = async () => {
    if (!selectedFile || !previewSrc || !imageReady) return;

    setUploading(true);
    setAvatarError("");
    try {
      const croppedFile = await buildCroppedAvatarFile();
      const form = new FormData();
      form.append("avatar", croppedFile);
      await uploadAvatar(form);
      await refreshProfile();
      resetAvatarPicker();
    } catch (_err) {
      setAvatarError("Unable to upload avatar. Try a different image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="feed-page">
      <Navbar />
      <div className="profile-page">
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>Loading profile...</p>
          </div>
        ) : null}

        {!loading && error ? <p className="feed-error">{error}</p> : null}

        {!loading && !error && profileData ? (
          <>
            <section className="profile-header">
              <div className="profile-avatar-wrap">
                {profileData.profile?.avatar_url ? (
                  <img
                    src={profileData.profile.avatar_url}
                    alt={username}
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar profile-avatar-fallback">
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
                {isOwnProfile ? (
                  <div className="change-avatar-wrap">
                    <button
                      type="button"
                      className="change-avatar-btn"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Change avatar"}
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleAvatarFileChange}
                    />

                    {previewSrc ? (
                      <div className="avatar-preview-wrap">
                        <div
                          ref={cropperRef}
                          className="avatar-cropper"
                          onPointerDown={handleAvatarPointerDown}
                          onPointerMove={handleAvatarPointerMove}
                          onPointerUp={handleAvatarPointerUp}
                          onPointerCancel={handleAvatarPointerUp}
                          onPointerLeave={handleAvatarPointerUp}
                          style={{ cursor: dragging ? "grabbing" : "grab" }}
                        >
                          <img
                            ref={imageRef}
                            src={previewSrc}
                            alt="preview"
                            className="avatar-preview"
                            onLoad={handleAvatarImageLoad}
                            draggable={false}
                            style={{
                              transform: `translate(${cropState.x}px, ${cropState.y}px) scale(${cropState.scale})`,
                            }}
                          />
                          <div className="avatar-crop-overlay" />
                        </div>
                        <label className="avatar-zoom-control">
                          <span>Zoom</span>
                          <input
                            type="range"
                            min="1"
                            max="2.5"
                            step="0.01"
                            value={cropBaseScale ? cropZoom : 1}
                            onChange={handleZoomChange}
                            disabled={uploading}
                          />
                        </label>
                        <p className="avatar-crop-hint">Drag the image to position it inside the square crop.</p>
                        <div className="avatar-preview-actions">
                          <button
                            type="button"
                            className="confirm-avatar-btn"
                            onClick={handleConfirmAvatarUpload}
                            disabled={uploading || !imageReady}
                          >
                            Confirm Upload
                          </button>
                          <button
                            type="button"
                            className="cancel-avatar-btn"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewSrc(null);
                              if (avatarInputRef.current) avatarInputRef.current.value = null;
                            }}
                            disabled={uploading}
                          >
                            Cancel
                          </button>
                        </div>
                        {avatarError ? <p className="avatar-error">{avatarError}</p> : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="profile-main">
                <div className="profile-top-row">
                  <h1>{profileData.user?.username || username}</h1>
                  {!isOwnProfile ? (
                    <FollowButton
                      targetUserId={profileData.user?.id}
                      initialFollowing={initialFollowing}
                      onFollowChange={(delta) => setFollowerCount((prev) => prev + delta)}
                    />
                  ) : null}
                </div>

                <div className="profile-stats">
                  <p>
                    <strong>{profileData.profile?.posts_count || profileData.posts?.length || 0}</strong> posts
                  </p>
                  <p>
                    <strong>{followerCount}</strong> followers
                  </p>
                  <p>
                    <strong>{profileData.profile?.following_count || 0}</strong> following
                  </p>
                </div>

                <p className="profile-bio">{profileData.profile?.bio || "No bio yet."}</p>
              </div>
            </section>

            <PostGrid posts={profileData.posts || []} />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ProfilePage;
