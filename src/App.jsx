import Header from "./Components/Header";
import Content from "./Components/Content";
import movieData from "./Utils/Utils";
import VideoPlayer from "./Vidplayer";
import { Route, Routes } from "react-router-dom";
import Popular from "./Components/Popular";
import Home from "./Home";
import Shows from "./Components/Shows";
import MediaDetails from "./Components/MediaDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 60 * 1000,
      }
    }
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path=":type/:id" element={<MediaDetails />}></Route>
        
          <Route path="/home" element={<Home />}></Route>
          <Route path="/popular" element={<Popular />}></Route>
          <Route path="/shows" element={<Shows />}></Route>
        </Routes>
      </QueryClientProvider>

      {/* <VideoPlayer url="https://vidsrc.dev/embed/movie/tt1160419" />  */}
    </>
  );
}

export default App;
