import { data } from "react-router-dom";

export default async function fetchWatchList() { 
    try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/watchlist`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const watchlistData = await response.json();
         return {
            watchlistData: watchlistData,
         }
      } catch (err) {
        console.error("Error fetching profile:", err);;
      }
    }    
    