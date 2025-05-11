import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import movieData from "../Utils/Utils";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoAddCircle } from "react-icons/io5";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../Utils/HandleWatchlist";
import { motion } from "motion/react";

function MediaDetails() {
  const { type, id } = useParams();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`${type}-details`, id],
    queryFn: async () => {
      const data = await movieData(`${type}/${id}?extended=full`);
      console.log(data);
      if (!data) throw new Error("No data received");
      return data;
    },
    suspense: true,
  });

  if (isError)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          Error loading {type === "movies" ? "movie" : "show"} details
        </div>
      </div>
    );

  if (!response) return <h1>No data found</h1>;

  const media = response.movie || response.show || response;
  const mediaType = response.movie ? "movies" : "shows";

  const posterUrl = media?.ids?.imdb
    ? `https://img.omdbapi.com/?i=${media.ids.imdb}&apikey=${
        import.meta.env.VITE_OMDB_API_KEY
      }`
    : media?.ids?.tmdb
    ? `https://image.tmdb.org/t/p/original/${media.ids.tmdb}.jpg`
    : null;

  //Embed URL converter function
  function convertToEmbedUrl(url) {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  const trailerUrl = media.trailer;
  const trailerEmbedUrl = trailerUrl ? convertToEmbedUrl(trailerUrl) : null;

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const result = await getWatchlist();
        console.log("Current watchlist:", result);

        if (result) {
          const isInList = result.some((item) => {
            const mediaItem = item.movie || item.show;
          });
          setIsInWatchlist(isInList);
          console.log("Is in watchlist:", isInList);
        }
      } catch (error) {
        console.error("Watchlist check error:", error);
      }
    };
    fetchWatchlist();
  }, [media.ids.imdb]);

  const handleWatchLaterToggle = async () => {
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(id, type);
        setWatchlist((prev) =>
          prev.filter((item) => {
            const m = item.movie || item.show;
          })
        );
        console.log("Removed from watchlist");
      } else {
        const result = await addToWatchlist(id, type);
        setWatchlist((prev) => [...prev, { ...media }]);
        console.log("Added to watchlist:", result);
      }
      setIsInWatchlist(!isInWatchlist);
      const updatedList = await getWatchlist();
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
      > 
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-Figtree">
      {/* Poster Column - Same for both mobile and desktop */}
      <div className="mt-6 flex justify-center">
        <div className="overflow-hidden shadow-lg w-[340px] h-[500px] max-md:w-[280px] max-md:h-[420px]">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={media.title}
              className="w-full h-full rounded-lg shadow-lg overflow-hidden object-cover transform transition-transform duration-200 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              No poster available
            </div>
          )}
        </div>
      </div>

      {/* Details Column - Mobile optimizations */}
      <div className="flex flex-col gap-2 pt-6 pr-4 items-center md:items-start px-4 max-md:px-2">
        <div className="flex flex-col flex-wrap items-center">
          <h1 className="font-extrabold text-3xl md:text-4xl max-md:text-2xl text-pretty text-center md:text-left">
            {media.title} ({media.year || "N/A"})
            <span className="font-normal text-base md:text-xl pl-3 max-md:block max-md:pl-0 max-md:pt-2">
              {`${media.runtime} mins` || "N/A"}
            </span>
            <div className="flex flex-row pt-2 w-full justify-center md:justify-start">
              <button
                onClick={handleWatchLaterToggle}
                className="flex items-center gap-2 text-base font-normal px-5 hover:bg-gray-200 border border-black dark:border-[#F8F8FF] dark:hover:text-black border-2 rounded-xl max-md:text-sm max-md:px-3"
              >
                {isInWatchlist ? <IoAddCircle /> : <IoAddCircleOutline />}
                {isInWatchlist
                  ? "Remove from Watch Later"
                  : "Add to Watch Later"}
              </button>
            </div>
          </h1>
        </div>

        <div className="font-normal text-lg md:text-xl max-md:text-base w-full max-md:px-2">
          <p className="max-md:text-justify">{media.overview || "No overview available."}</p>

          {media.tagline && <p className="italic max-md:text-center">{media.tagline}</p>}

          <div className="space-y-2 max-md:space-y-1">
            <p>
              <span className="font-bold">Certification: </span>
              {media.certification || "N/A"}
            </p>

            <p>
              <span className="font-bold">Release Date: </span>
              {media.released || "N/A"}
            </p>

            <p>
              <span className="font-bold">Genre: </span>
              {media.genres?.join(", ") || "N/A"}
            </p>
            <p>
              <span className="font-bold">Rating: </span>
              {media.rating ? Math.floor(media.rating * 10) / 10 : "N/A"}
            </p>
            <p>
              <span className="font-bold">Status: </span>
              {media.status || "N/A"}
            </p>
          </div>

          <div className="mt-4">
            <p className="font-bold">Trailer: </p>
            {trailerEmbedUrl ? (
              <div className="w-full max-md:w-full">
                <iframe
                  src={trailerEmbedUrl}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="video"
                  className="w-full md:w-[400px] h-[240px] max-md:h-[240px]"
                />
              </div>
            ) : (
              "N/A"
            )}
          </div>
        </div>
      </div>
    </div>
    </motion.div>
  );
}

export default MediaDetails;