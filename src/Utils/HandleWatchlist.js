export const getWatchlist = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/watchlist`, {
    credentials: "include",
  });
  return res.json();
};

export const addToWatchlist = async (id, type) => {
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
  if (!response.ok) throw new Error("Failed to add");
  return response.json();
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
