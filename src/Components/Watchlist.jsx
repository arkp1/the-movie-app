import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import fetchWatchList from "../Utils/FetchWatchlist";

function Watchlist() {
  const [Watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWatchlist = async () => {
      setIsLoading(true);
      try {
        const result = await fetchWatchList();
        console.log(result);

        if (result?.watchlistData) {
          setWatchlist(result.watchlistData);
        } else {
          setError("Please sign in to view your watchlist.");
        }
      } catch (err) {
        setError("Failed to fetch watchlist data.");
        console.error("Profile error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getWatchlist();
  }, []);

  if (isLoading) return <div className="pt-10">Loading...</div>;
  if (error) return <div className="pt-10">{error}</div>;
  if (!Watchlist.length)
    return <div className="">Watchlist data unavailable.</div>;

  return (
    <>
    <div className="py-8 px-5">
    <div className="pb-6">
    <p
    className="text-3xl font-bold"
    >Your Watchlist</p>
  </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {Watchlist.map((item) => (
      <Link
        key={`${item.id}`}
        to={`/movies/${item.movie.ids.imdb}`}
        className="group"
      >
        <div className="relative overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:-translate-y-1">
          <img
            src={`https://img.omdbapi.com/?i=${item.movie.ids.imdb}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`}
            alt={item.movie.title}
            className="w-full h-80 max-h-full object-cover"
            onError={(e) => {
              e.target.classList.add("bg-gray-400");
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-2">
          <h3 className="font-medium truncate">{item.movie.title}</h3>
        </div>
      </Link>
    ))}
  </div>
  </div>
  </>
  );
}

export default Watchlist;
