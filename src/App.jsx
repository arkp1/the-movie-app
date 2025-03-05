import Header from "./Components/Header";
import Content from "./Components/Content";
import movieData from "./Utils/Utils";
import VideoPlayer from "./Vidplayer";
import { Route, Routes } from "react-router-dom";
import Top from "./Components/Top";
import Home from "./Home";
import Trending from "./Components/Trending";
import MovieDetails from "./Components/MovieDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/movie/:id" element={<MovieDetails />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/popular" element={<Top />}></Route>
          <Route path="/trending" element={<Trending />}></Route>
        </Routes>
      </QueryClientProvider>

      {/* <VideoPlayer url="https://vidsrc.dev/embed/movie/tt1160419" />  */}
    </>
  );
}

export default App;
