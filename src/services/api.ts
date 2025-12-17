const API_KEY = "72a58d1e531f028663a85a904b525646";
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
};

export const searchMovies = async (query: string, page: number = 1) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    const data = await response.json();
    return data;
};

export const getMovieDetails = async (movieId: number) => {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`);
    const data = await response.json();
    return data;
};

export const getTrendingMovies = async (timeWindow: 'day' | 'week', page: number = 1) => {
    const response = await fetch(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&page=${page}`);
    const data = await response.json();
    return data;
};