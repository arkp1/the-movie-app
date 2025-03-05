// const movieData = async (title) => {
//   const omdbAPI = import.meta.env.VITE_OMDB_API_KEY;
//   const tmdbAPI = import.meta.env.VITE_TMDB_API_KEY;

// //       try{
// //       const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${omdbAPI}`

// //       const response = await fetch(url)

// //       if(!response.ok) {
// //           console.log("fetch error")
// //       }
// //       const data = await response.json()
// //       console.log(data)
// //   }
// //   catch (e) {
// //       console.log(e)
// //   }
// // };

const baseUrl = "https://imdb236.p.rapidapi.com/imdb";
const imdbAPI = import.meta.env.VITE_IMDB_API_KEY;

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": imdbAPI,
    "x-rapidapi-host": "imdb236.p.rapidapi.com",
  },
};

const movieData = async (endpoint) => {
  try {
    const response = await fetch(`${baseUrl}/${endpoint}`, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default movieData;
