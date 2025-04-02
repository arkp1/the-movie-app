import React, { useState, useEffect } from "react";
import fetchUserProfile from "../Utils/FetchProfile";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      setIsLoading(true);
      try {
        const result = await fetchUserProfile();

        if (result?.isAuthenticated) {
          setProfileData(result.profile);
        } else {
          return
        }
      } catch (err) {
        setError("Failed to fetch profile data.");
        console.error("Profile error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getProfile();
  }, []);

  if (isLoading) return <div className="pt-10">Loading...</div>;
  if (error) return <div className="pt-10">{error}</div>;
  if (!profileData)
    return <div className="flex justify-center items-center text-2xl">
      Please sign in to view your profile.</div>;

  return (
    <div className="pt-10">
      {profileData.user && (
        <div>
          <h1>{profileData.user.username}</h1>
          {profileData.user.images?.avatar?.full && (
            <img
              src={profileData.user.images.avatar.full}
              alt="Profile"
              style={{ width: "100px", height: "100px" }}
              crossOrigin="anonymous"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
