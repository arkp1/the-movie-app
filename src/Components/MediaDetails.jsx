import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import movieData from "../Utils/Utils";

function MediaDetails() {
  const { type, id } = useParams(); // Get both type and id from URL
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
  });

  if (isLoading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h1 className="text-white text-xl">Loading...</h1>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          Error loading {type === "movies" ? "movie" : "show"} details
        </div>
      </div>
    );

  if (!response) return <h1>No data found</h1>;

  // Handle both direct object and nested responses
  const media = response.movie || response.show || response;
  const mediaType = response.movie ? "movie" : "show";

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
  const trailerEmbedUrl = convertToEmbedUrl(trailerUrl);
  console.log(trailerEmbedUrl);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white-50 font-Figtree mb-3">
      {/* Poster Column */}
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

      {/* Details Column */}
      <div className="flex flex-col gap-2 pt-6 pr-4 items-center md:items-start px-4 max-md:px-2">
        <div className="flex flex-col flex-wrap items-center">
          <h1 className="font-extrabold text-3xl md:text-4xl max-md:text-2xl text-pretty">
            {media.title} ({media.year || "N/A"})
            <span className="font-normal text-base md:text-xl pl-3">
              {`${media.runtime} mins` || "N/A"}
            </span>
          </h1>
        </div>

        <div className="font-medium text-lg md:text-xl max-md:text-base">
          <p>{media.overview || "No overview available."}</p>

          {media.tagline && (
            <p className="italic">
              <span className="font-bold">Tagline: </span>
              {media.tagline}
            </p>
          )}

          <>
            <p>
              <span className="font-bold">Certification: </span>
              {media.certification || "N/A"}
            </p>
          </>

          {mediaType === "show" && (
            <>
              <p>
                <span className="font-bold">Release Date: </span>
                {media.released || "N/A"}
              </p>
            </>
          )}

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
          <p>
          <span className="font-bold">Trailer: </span>
          <iframe
            src={trailerEmbedUrl}
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
            title="video"
            width={600}
            height={300}
          />
        </p>
        </div>
      </div>
    </div>
  );
}

export default MediaDetails;
