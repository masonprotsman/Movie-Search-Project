import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies, getTrendingMovies } from "../services/api";
import '../css/Home.css';

function Home() {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [movies, setMovies] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [trendingPeriod, setTrendingPeriod] = useState<'day' | 'week'>('day');

    useEffect(() => {
        const loadTrendingMovies = async () => {
            try {
                const trendingMovies = await getTrendingMovies(trendingPeriod);
                setMovies(trendingMovies);
            } catch (err) {
                console.log(err);
                setError("Failed to load movies...");
            }
            finally {
                setLoading(false);
            }
        };
        loadTrendingMovies();
    }, [trendingPeriod]);

    const handleSearch = async (e: any) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        if (loading) return;
        setLoading(true);
        try {
            const searchResults = await searchMovies(searchQuery);
            setMovies(searchResults);
            setError(null);
        } catch (err) {
            console.log(err);
            setError("Failed to search movies...");
        } finally {
            setLoading(false);
        }
    }

    const clearSearch = async () => {
        setSearchQuery("");
        setLoading(true);
        getTrendingMovies(trendingPeriod).then(trendingMovies => {
            setMovies(trendingMovies);
            setError(null);
        }).catch(err => {
            console.log(err);
            setError("Failed to load movies...");
        }).finally(() => {
            setLoading(false);
        });
    }

    return <div className="home">
        <form onSubmit={handleSearch} className="search-form">
            <span className="search-css">
                <input
                    type="text"
                    placeholder="Search movies..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* create clear button to reset the search */}
                {/* change the code to call a function instead of inline ts */}
                <button type="submit" className="search-btn">Search</button>
                {searchQuery.trim() && <button type="button" className="clear-btn" onClick={clearSearch}>Clear</button>}
            </span>
        </form>
        <div className="trending-toggle">
            <h3 className="trending-title">Trending</h3>
            <div className="trending-buttons">
                <button 
                    className={`toggle-btn ${trendingPeriod === 'day' ? 'active' : ''}`}
                    onClick={() => setTrendingPeriod('day')}
                >
                    Today
                </button>
                <button 
                    className={`toggle-btn ${trendingPeriod === 'week' ? 'active' : ''}`}
                    onClick={() => setTrendingPeriod('week')}
                >
                    This Week
                </button>
            </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
            <div className="loading">Loading...</div>
        ) : (
            <div className="movies-grid">
                {movies.map(movie => (
                    <MovieCard movie={movie} key={movie.id} />
                ))}
            </div>
        )}
    </div>
}

export default Home;