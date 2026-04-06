import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import FollowButton from "../components/FollowButton";
import Navbar from "../components/Navbar";
import PostGrid from "../components/PostGrid";
import { getCurrentUser } from "../services/authService";
import { getProfileByUsername } from "../services/userService";

function ProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followerCount, setFollowerCount] = useState(0);

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

  const currentUser = getCurrentUser();
  const isOwnProfile = currentUser?.username === username;

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
              </div>

              <div className="profile-main">
                <div className="profile-top-row">
                  <h1>{profileData.user?.username || username}</h1>
                  {!isOwnProfile ? (
                    <FollowButton
                      targetUserId={profileData.user?.id}
                      onFollowChange={(delta) => setFollowerCount((prev) => prev + delta)}
                    />
                  ) : null}
                </div>

                <div className="profile-stats">
                  <p>
                    <strong>{profileData.posts?.length || 0}</strong> posts
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
