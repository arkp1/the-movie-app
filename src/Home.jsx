import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import movieData from "./Utils/Utils";
import VideoPlayer from "./Vidplayer";
import { Link, Route, Routes } from "react-router-dom";
import mockData from "./assets/Mock";

function Home() {
  const { data: movies } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const data = await movieData(`most-popular-movies`);

      return data.map((movie) => ({
        id: movie.id,
        poster: movie.primaryImage,
        title: movie.primaryTitle,
      }));
    },
  });

  

  return (
    <>
      {/* <VideoPlayer url="https://vidsrc.dev/embed/movie/tt1160419" />  */}
       <div className="grid grid-cols-2 md:grid-cols-5 gap-5 justify-items-center">
        {movies?.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`}>
            <div key={movie.id} className="p-4 text-center">
              <img
                src={movie.poster}
                alt={movie.title}
                width={200}
                height={300}
                className="rounded-lg shadow-lg transform transition-transform duration-110 hover:scale-105 cursor-pointer"
              />
              <p className="text-lg font-semibold">{movie.title}</p>
            </div>
          </Link>
        ))}

        {/* Mock testing */}
        {/* {mockData?.map((movie) => (
          <Link key={movie.id} to={`/${encodeURIComponent(movie.Title)}`}>
          <div className="p-4 border-b text-center">
            <img
              src={movie.Poster}
              alt={movie.Title}
              width={200}
              height={300}
              className="rounded-lg shadow-lg transform transition-transform duration-110 hover:scale-105 cursor-pointer"
            />
            <p className="text-lg font-semibold">{movie.Title}</p>
          </div>
          </Link>
        ))} */}
      </div>
    </>
    )
  }

export default Home;
