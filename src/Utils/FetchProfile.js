export default async function fetchUserProfile() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/profile`,
      {
        credentials: "include",
      }
    );
    if (!response.ok) {
      if (response.status === 401) {
        return {
          isAuthenticated: false,
          profile: null,
          error: "unauthorized",
        };
      }
      throw new Error("Failed to fetch profile");
    }
    const profileData = await response.json();
    return {
      isAuthenticated: true,
      profile: profileData,
      error: null,
    };
  } catch (err) {
    console.error("Error fetching profile:", err);
    return {
      isAuthenticated: false,
      profile: null,
      error: err.message,
    }; // Indicate error
  }
}
