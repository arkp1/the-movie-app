import { useQuery } from "@tanstack/react-query";
import movieData from "./Utils/Utils";
import { Link } from "react-router-dom";
import { useState } from "react";

function Home() {
  const [page, setPage] = useState(1);
  const {
    data: trendingItems,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["trending-movies", page],
    queryFn: async () => {
      const response = await movieData("movies/trending", { page, limit: 20 });
      console.log(response)
      if (!response) throw new Error("No data received");
      return response;
    },
    keepPreviousData: true,
  });

  // Transform the data for rendering
  const movies = trendingItems?.map((item) => {
    // In the movies transformation part, change the posterUrl to:
    const posterUrl = item.movie.ids.imdb
      ? `https://img.omdbapi.com/?i=${item.movie.ids.imdb}&apikey=${
          import.meta.env.VITE_OMDB_API_KEY
        }`
      : `https://image.tmdb.org/t/p/original/${item.movie.ids.tmdb}.jpg`;
    const id =
      item?.movie?.ids?.imdb ||
      item?.movie?.ids?.slug ||
      item?.movie?.ids?.trakt;

    return {
      id: id,
      title: item.movie.title,
      year: item.movie.year,
      poster:
        posterUrl ||
        `https://image.tmdb.org/t/p/original/${item.movie.ids.tmdb}.jpg`,
    };
  });

  // Pagination logic
  const totalPages = 10; // Adjust based on your API's total pages

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          Error loading movies: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {isLoading ? (
        <div className="flex justify-center items-center h-64 w-full">
          <div className="animate-pulse text-xl text-gray-600">
            Loading trending movies...
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">
            Trending Movies
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies?.map((movie) => (
              <Link
                key={`${movie.id}-${page}`}
                to={`/movies/${movie.id}`}
                className="group"
              >
                <div className="relative h-full md:h-full overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  {movie?.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-fit object-cover"
                    />
                  ) : (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-80 object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-4 absolute bottom-0 left-0 right-0 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium">{movie.year}</p>
                  </div>
                  <div className="p-2">
                    <h3 className="font-semibold truncate">
                      {movie.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center mt-12 space-x-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isFetching}
              className={`px-4 py-2 rounded-md ${
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
                        : "hover:bg-gray-500"
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
              className={`px-4 py-2 rounded-md ${
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
      )}
    </div>
  );
}

export default Home;
