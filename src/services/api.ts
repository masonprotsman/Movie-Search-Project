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

export const getTrendingMovies = async (timeWindow: 'day' | 'week') => {
    // Fetch first 5 pages of trending movies to get 100 total
    const pages = [1, 2, 3, 4, 5];
    const responses = await Promise.all(
        pages.map(p => fetch(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&page=${p}`))
    );
    
    const allData = await Promise.all(responses.map(res => res.json()));
    
    // Combine all results
    const allMovies = allData.flatMap(data => data.results);
    
    // Filter out movies that haven't been released yet
    const today = new Date();
    const releasedMovies = allMovies.filter(movie => {
        if (!movie.release_date) return false;
        const releaseDate = new Date(movie.release_date);
        return releaseDate <= today;
    });
    
    // Sort by release date (newest first)
    const sortedMovies = releasedMovies.sort((a, b) => {
        const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
        const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
        return dateB - dateA;
    });
    
    // Return first page structure with filtered and sorted movies
    return {
        ...allData[0],
        results: sortedMovies,
        page: 1,
        total_pages: 1
    };
};