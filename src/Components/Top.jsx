import { useState, useEffect } from "react";
import Header from "./Header";
import Content from "./Content";
import movieData from "../Utils/Utils";
import VideoPlayer from "../Vidplayer";
import { Route } from "react-router-dom";
import mockData from "../assets/Mock";

function Top() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await movieData(`top250-movies`);
      setMovies(
        data.map((movie) => ({
          id: movie.id,
          poster: movie.primaryImage,
          title: movie.originalTitle,
        }))
      );
    };
    fetchMovies();
  }, []);

  return (
    <>
      {/* <Content /> */}
      {/* <VideoPlayer url="https://vidsrc.dev/embed/movie/tt1160419" />  */}
      <div>
        <p className="text-4xl flex ml-10 mt-3 mb-3">Popular</p>
      </div>
      <div className="grid grid-cols-5 gap-5 justify-items-center">
        {/* {movies.map((movie) => (
          <div key={movie.id} className="p-4 border-b text-center">
            <img
              src={movie.poster}
              alt={movie.title}
              width={200}
              height={300}
              className="rounded-lg shadow-lg transform transition-transform duration-110 hover:scale-105 cursor-pointer"
            />
            <p className="text-lg font-semibold">{movie.title}</p>
          </div>
        ))} */}

        {/* {mockData.map((movie) => (
          <div key={movie.id} className="p-4 border-b text-center">
            <img
              src={movie.Poster}
              alt={movie.Title}
              width={200}
              height={300}
              className="rounded-lg shadow-lg transform transition-transform duration-110 hover:scale-105 cursor-pointer"
            />
            <p className="text-lg font-semibold">{movie.Title}</p>
          </div>
        ))} */}

{mockData.map((movie) => (
  <div key={movie.id} className="relative w-[200px] m-5">
    <div className="relative transform transition-transform duration-200 hover:scale-105">
      <img
        src={movie.Poster}
        alt={movie.Title}
        width={200}
        height={300}
        className="rounded-lg cursor-pointer"
      />
      {/* White Fade-Out Overlay */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-white to-transparent rounded-b-lg"></div>
    </div>
    {/* Title */}
    <p className="absolute top-[280px] left-1/2 transform -translate-x-1/2 text-black font-semibold text-lg text-center w-full px-2">
      {movie.Title}
    </p>
  </div>
))}


      </div>
    </>
  );
}

export default Top;
