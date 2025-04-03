export const getWatchlist = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/watchlist`, {
      credentials: "include",
    });
    if (!res.ok) {
      console.error("Error fetching watchlist:", res.status);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return null;
  }
};

export const addToWatchlist = async (id, type) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/watchlist/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id, type }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Add error response:", errorData);
      throw new Error(errorData.message || "Failed to add to watchlist");
    }

    const data = await response.json();
    console.log("add data", data);
    return data;
  } catch (error) {
    console.error("error adding", error);
  }
};

export const removeFromWatchlist = async (id, type) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/watchlist/remove`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, type }),
    }
  );
  if (!response.ok) throw new Error("Failed to remove");
  return response.json();
};
