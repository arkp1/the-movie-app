import Header from "./Components/Header";
import { useEffect, useState, Suspense } from "react";
import Content from "./Components/Content";
import VideoPlayer from "./Vidplayer";
import { Route, Routes } from "react-router-dom";
import Popular from "./Components/Popular";
import Home from "./Home";
import Shows from "./Components/Shows";
import MediaDetails from "./Components/MediaDetails";
import SuspenseWrapper from "./Components/SuspenseWrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MediaDetailsSkeleton from "./Components/MediaDetailsSkeleton";
import Profile from "./Components/Profile";

function App() {
  const [isDark, setIsDark] = useState(false);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 60 * 1000,
      },
    },
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="bg-[#F8F8FF] text-black dark:bg-zinc-900 dark:text-[#F8F8FF] min-h-screen">
          <div className="pt-16">
            <Header toggleDarkMode={toggleDarkMode} isDark={isDark} />
          </div>
          <SuspenseWrapper>
            <Routes>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/" element={<Home />}></Route>
              <Route
                path=":type/:id"
                element={
                  <Suspense fallback={<MediaDetailsSkeleton />}>
                    <MediaDetails />
                  </Suspense>
                }
              ></Route>

              <Route path="/home" element={<Home />}></Route>
              <Route path="/popular" element={<Popular />}></Route>
              <Route path="/shows" element={<Shows />}></Route>
            </Routes>
          </SuspenseWrapper>
        </div>
      </QueryClientProvider>

      {/* <VideoPlayer url="https://vidsrc.dev/embed/movie/tt1160419" />  */}
    </>
  );
}

export default App;
