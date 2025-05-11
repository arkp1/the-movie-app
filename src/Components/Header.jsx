import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sun, Moon, Menu } from "lucide-react";
import movieData from "../Utils/Utils";
import fetchUserProfile from "../Utils/FetchProfile";

function Header({ toggleDarkMode, isDark }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  //Check Auth Status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const result = await fetchUserProfile();
        setIsLoggedIn(result?.isAuthenticated || false);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setIsLoggedIn(false);
        navigate("/home");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  //SEARCH
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const performSearch = async (query) => {
    setIsSearching(true);
    try {
      const data = await movieData(
        `search/movie,show?query=${encodeURIComponent(query)}&extended=full`
      );
      setSearchResults(data.slice(0, 5));
    } catch (error) {
      console.log("search error", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (type, id) => {
    navigate(`/${type === "movie" ? "movies" : "shows"}/${id}`);
    setSearchQuery("");
    setSearchResults([]);
    setIsMobileMenuOpen(false);
    setShowMobileSearch(false);
  };

  const handleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth`;
  };

  return (
    // <div className="relative pb-8">
      <header
        className={`fixed top-0 left-0 z-50 backdrop-blur-xl ${
          isDark ? "backdrop-blur-3xl" : "bg-[#cfd9df]/40 backdrop-blur-2xl"
        }`}
      >
        <div className="flex w-screen h-20 font-Figtree items-center border-black shadow-lg dark:shadow-2xl">
          <Link to="/">
          <div className="font-semibold text-4xl pl-6 m-4 mr-6 max-md:text-3xl max-md:pl-3 max-md:m-2">
            MovieTime
          </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-between gap-6 mt-1">
            <Link to="/home" className="underline-animation">Home</Link>
            <Link to="/popular" className="underline-animation">Popular</Link>
            <Link to="/shows" className="underline-animation">Shows</Link>
            <Link to="/profile" className="underline-animation">Profile</Link>
            <Link to="/watchlist" className="underline-animation">Watchlist</Link>
          </div>

          {/* Desktop Search and Auth Section */}
          <div className="hidden md:flex items-center ml-auto pr-5 relative">
            {isLoggedIn ? (
              <button className="mr-5 underline-animation" onClick={handleSignOut}>Sign Out</button>
            ) : (
              <button className="mr-5 underline-animation" onClick={handleSignIn}>Sign In</button>
            )}
            <button className="ml-auto pr-5" onClick={toggleDarkMode}>
              {isDark ? <Sun /> : <Moon />}
            </button>
     
            <input
              className={`border ${
                isDark
                  ? "bg-zinc-900 border-white"
                  : "bg-white/60 border-zinc-900"
              } w-60 h-8 indent-3 rounded-2xl max-md:w-40 max-md:indent-2 max-md:text-sm`}
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              strokeWidth={2.25}
              className="cursor-pointer absolute right-7 top-1/2 transform -translate-y-1/2 w-5 transition-transform hover:scale-105"
            />

            {/* Desktop Search Results Dropdown */}
            {searchQuery.length > 0 && (
              <div className="absolute top-full mt-1 left-28 w-60 max-md:w-40 bg-[#F8F8FF] dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
                {isSearching ? (
                  <div className="p-2 text-center">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((result) => {
                      const item = result.movie || result.show;
                      const type = result.type;
                      return (
                        <li
                          key={item.ids.imdb}
                          className="p-2 bg-[#F8F8FF] text-black border-gray-100 dark:bg-zinc-900 dark:text-[#F8F8FF] dark:border-gray-900 dark:hover:bg-zinc-800 hover:bg-gray-200 cursor-pointer border-b last:border-b-0"
                          onClick={() => handleResultClick(type, item.ids.imdb)}
                        >
                          <div className="font-medium truncate">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {type === "movie" ? "Movie" : "TV Show"} •{" "}
                            {item.year}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="p-2 text-center text-gray-500">
                    {searchQuery.length < 3
                      ? "Type at least 3 characters"
                      : "No results found"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Controls - Search, Dark Mode, and Menu */}
          <div className="md:hidden flex items-center ml-auto pr-3 gap-3">
            <button onClick={() => setShowMobileSearch(!showMobileSearch)}>
              <Search size={24} />
            </button>
            <button onClick={toggleDarkMode}>
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        {showMobileSearch && (
          <div className="md:hidden px-3 pb-3 relative">
            <input
              className={`border ${
                isDark
                  ? "bg-zinc-900 border-white"
                  : "bg-white/60 border-zinc-900"
              } w-full h-10 indent-3 rounded-2xl text-sm`}
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {/* Mobile Search Results Dropdown */}
            {searchQuery.length > 0 && (
              <div className="absolute top-full left-3 right-3 bg-[#F8F8FF] dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
                {isSearching ? (
                  <div className="p-2 text-center">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((result) => {
                      const item = result.movie || result.show;
                      const type = result.type;
                      return (
                        <li
                          key={item.ids.imdb}
                          className="p-2 bg-[#F8F8FF] text-black border-gray-100 dark:bg-zinc-900 dark:text-[#F8F8FF] dark:border-gray-900 dark:hover:bg-zinc-800 hover:bg-gray-200 cursor-pointer border-b last:border-b-0"
                          onClick={() => handleResultClick(type, item.ids.imdb)}
                        >
                          <div className="font-medium truncate">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {type === "movie" ? "Movie" : "TV Show"} •{" "}
                            {item.year}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="p-2 text-center text-gray-500">
                    {searchQuery.length < 3
                      ? "Type at least 3 characters"
                      : "No results found"}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden ${isDark ? "bg-zinc-800" : "bg-white"} w-full py-4 px-6 shadow-lg`}>
            <div className="flex flex-col space-y-4">
              <Link to="/home" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/popular" onClick={() => setIsMobileMenuOpen(false)}>Popular</Link>
              <Link to="/shows" onClick={() => setIsMobileMenuOpen(false)}>Shows</Link>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
              <Link to="/watchlist" onClick={() => setIsMobileMenuOpen(false)}>Watchlist</Link>
              
              <div className="pt-2">
                {isLoggedIn ? (
                  <button onClick={handleSignOut}>Sign Out</button>
                ) : (
                  <button onClick={handleSignIn}>Sign In</button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    // </div>
  );
}

export default Header;