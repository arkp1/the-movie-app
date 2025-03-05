import { useState, useEffect } from "react";
import Header from "./Header";
import Content from "./Content";
import movieData from "../Utils/Utils";
import VideoPlayer from "../Vidplayer";
import { Route } from "react-router-dom";
import mockData from "../assets/Mock";

function Trending() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await movieData(`top-box-office`);
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
      <Content />
      {/* <VideoPlayer url="https://vidsrc.dev/embed/movie/tt1160419" />  */}
      <div>
        <p className="text-4xl flex ml-10 mt-3 mb-3">Trending</p>
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
        {mockData.map((movie) => (
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
        ))}
      </div>
    </>
  );
}

export default Trending;
