import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

function Header() {
  return (
    <header>
      <div className="flex w-full h-20 font-Figtree items-center border-black bg-white-100 shadow-lg">
        <div className="font-semibold text-4xl pl-6 m-4 mr-6">MovieBase</div>
        <div className="flex justify-between gap-6 mt-1">
          <Link to="/home" className="">
            Home
          </Link>
          <Link to="/popular">Popular</Link>
          <Link to="/trending">Trending</Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-center ml-auto pr-5">
          <input
            className="border border-black w-60 h-8 indent-3 rounded-2xl"
            placeholder="Search"
          />
          <Search
          strokeWidth={2.25}
          className="cursor-pointer absolute transform translate-x-52 w-5 transition-transform hover:scale-125"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
