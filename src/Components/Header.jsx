import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sun, Moon } from "lucide-react";
import movieData from "../Utils/Utils";
import fetchUserProfile from "../Utils/FetchProfile";

function Header({ toggleDarkMode, isDark }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState();
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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setIsLoggedIn(false);
        navigate('/home');
      }
    } catch (error) {
      console.error('Logout error:', error);
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
  };

  const handleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth`;
  };

  return (
    <div className="relative pb-8">
      <header className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl ${
        isDark ? "backdrop-blur-3xl" : "bg-[#cfd9df]/40 backdrop-blur-2xl"
      }`}>
        <div className="flex w-full h-20 font-Figtree items-center border-black shadow-lg dark:shadow-2xl">
          <div className="font-semibold text-4xl pl-6 m-4 mr-6">MovieTime</div>
          <div className="flex justify-between gap-6 mt-1">
            <Link to="/home" className="">
              Home
            </Link>
            <Link to="/popular">Popular</Link>
            <Link to="/shows">Shows</Link>
            {isLoggedIn ? (
              <button onClick={handleSignOut}>Sign Out</button>
            ) : (
              <button onClick={handleSignIn}>Sign In</button>
            )}
            <Link to="/profile">Profile</Link>
            <Link to="/watchlist">Watchlist</Link>
          </div>

          {/* Search Bar */}
          <div className="flex items-center ml-auto pr-5 relative">
            <button className="ml-auto pr-5" onClick={toggleDarkMode}>
              {isDark ? <Sun /> : <Moon />}
            </button>
            <input
              className={`border ${
                isDark ? "bg-zinc-900 border-white" : "bg-white/60 border-zinc-900" 
              } w-60 h-8 indent-3 rounded-2xl max-md:w-40 max-md:indent-2 max-md:text-sm`}
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              strokeWidth={2.25}
              className="cursor-pointer absolute transform translate-x-64 w-5 transition-transform hover:scale-105
                       max-md:translate-x-32"
            />

            {/* Search Results Dropdown */}
            {searchQuery.length > 0 && (
              <div className="absolute top-full mt-1 left-11 w-60 max-md:w-40 bg-[#F8F8FF] dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
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
        </div>
      </header>
    </div>
  );
}

export default Header;
