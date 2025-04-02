import { useQuery } from "@tanstack/react-query";
import movieData from "../Utils/Utils";
import { Link } from "react-router-dom";
import { useState } from "react";

function Shows() {
  const [page, setPage] = useState(1);
  const {
    data: trendingShows,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["trending-shows", page],
    queryFn: async () => {
      const response = await movieData("shows/trending", { page, limit: 20 });
      if (!response) throw new Error("No data received");
      return response;
    },
    suspense: true,
    keepPreviousData: true,
  });

  // Transform the data for rendering
  const shows = trendingShows?.map((item) => {
    const posterUrl = item.show.ids.imdb
      ? `https://img.omdbapi.com/?i=${item.show.ids.imdb}&apikey=${
          import.meta.env.VITE_OMDB_API_KEY
        }`
      : `https://image.tmdb.org/t/p/original/${item.show.ids.tmdb}.jpg`;

    const id = item.show.ids.imdb || item.show.ids.slug || item.show.ids.trakt;

    return {
      id: id,
      title: item.show.title,
      year: item.show.year,
      poster: posterUrl,
      watchers: item.watchers,
    };
  });

  // Pagination logic
  const totalPages = 10;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          Error loading shows: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <>
        <h1 className="text-3xl font-bold mb-8">Trending Shows</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {shows?.map((show) => (
            <Link
              key={`${show.id}-${page}`}
              to={`/shows/${show.id}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:-translate-y-1">
                <img
                  src={show.poster}
                  alt={show.title}
                  className="w-full h-80 max-h-full object-cover"
                  onError={(e) => {
                    e.target.classList.add("bg-gray-400");
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-2">
                <h3 className="font-medium truncate">{show.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center mt-12 space-x-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isFetching}
            className={`px-4 py-2 rounded-md text-[#F8F8FF] ${
              page === 1 || isFetching
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isFetching}
                  className={`w-10 h-10 rounded-md ${
                    page === pageNum
                      ? "bg-blue-600"
                      : "hover:bg-gray-200 hover:text-black"
                  } ${isFetching ? "opacity-50" : ""}`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || isFetching}
            className={`px-4 py-2 rounded-md text-[#F8F8FF] ${
              page === totalPages || isFetching
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>

        {isFetching && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </>
    </div>
  );
}

export default Shows;
