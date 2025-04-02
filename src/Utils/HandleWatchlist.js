export const getWatchlist = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/watchlist`, { credentials: "include" });
  return res.json();
};

export const addToWatchlist = async (id, type) => {
  await fetch(`${import.meta.env.VITE_BACKEND_URL}/watchlist/add`, 
    {
      credentials: "include"
    }, 
    {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id, type }),
  });
};

export const removeFromWatchlist = async (id, type) => {
  await fetch(`${import.meta.env.VITE_BACKEND_URL}/watchlist/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id, type }),
  });
};
