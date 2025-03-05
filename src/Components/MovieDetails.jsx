import React, { useState, useEffect } from "react";
import mockData from "../assets/Mock";
import { data, useParams } from "react-router-dom";
import movieData from "../Utils/Utils";

function MovieDetails() {
  //Mock data
  // const { title } = useParams()
  // const movie = mockData.find(m => m.Title === decodeURIComponent(title))

  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await movieData(id);
        console.log(data);
        setMovie(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchMovie();
  }, [id]);

  if (!movie) return <h1>Loading...</h1>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white-50 font-Figtree">
        {/* Column-1 */}
        <div className="bg-green-40 mt-4 flex justify-center justify-items-center">
          <div className=" overflow-hidden shadow-lg w-[340px] h-[500px]">
            <img
              src={movie.primaryImage}
              alt={movie.primaryTitle}
              className="w-full h-full rounded-lg shadow-lg overflow-hidden object-cover transform transition-transform duration-200 hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>

        {/* Column-2 */}
        <div className="flex flex-col gap-2 bg-fuchsia-60 pt-5 pr-4 items-center md:items-start">
          {/* TITLE */}
          <div className="flex flex-col items-center">
            <h1 className="font-extrabold text-3xl md:text-4xl">
              {movie.primaryTitle} ({movie.startYear || "N/A"})
            </h1>
          </div>

          {/* MOVIE INFO */}
          <div className="font-medium text-lg md:text-xl">
            <p>{movie.description}</p>
            <p><span className="font-bold">Director:</span> {movie.directors[0].fullName || "N/A"}</p>
            <p>
              <span className="font-bold">Runtime:{" "}</span>
              {movie.runtimeMinutes ? `${movie.runtimeMinutes} Mins` : "N/A"}
            </p>
            <p><span className="font-bold">Genre:</span> {movie.genres?.join(", ") || "N/A"}</p>
            <p><span className="font-bold">Rating:</span> {movie.contentRating || "N/A"}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MovieDetails;
