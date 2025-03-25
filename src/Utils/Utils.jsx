const baseUrl = "https://api.trakt.tv/";
const traktAPI = import.meta.env.VITE_TRAKT_CLIENT_ID;

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": "2",
    "trakt-api-key": traktAPI,
  },
};

//API fetching
const movieData = async (
  endpoint,
  { page, limit, extended } = {}
) => {
  let url = `${baseUrl}${endpoint}`;

  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (extended) params.append("extended", extended);

  if ([...params].length) url += `?${params.toString()}`;

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error("Error fetching movie data:", err);
    return null;
  }
};


// const movieData = async (endpoint, page = 1, limit = 20, extended="") => {
//   try {
//     const response = await fetch(`${baseUrl}/${endpoint}?${extended ? "extended=full" : ""}page=${page}&limit=${limit}`, options);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log(result);
//     return result;
//   } catch (error) {
//     console.error("Error fetching movie data:", error);
//     return null;
//   }
// };

export default movieData;