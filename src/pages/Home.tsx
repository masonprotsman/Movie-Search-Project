import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { searchMovies, getTrendingMovies } from "../services/api";
import '../css/Home.css';

function Home() {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [movies, setMovies] = useState<any[]>([]);
    const [allMovies, setAllMovies] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [trendingPeriod, setTrendingPeriod] = useState<'day' | 'week'>('day');
    const [startYear, setStartYear] = useState<string>("");
    const [endYear, setEndYear] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

    useEffect(() => {
        const loadTrendingMovies = async () => {
            try {
                const data = await getTrendingMovies(trendingPeriod, 1);
                setAllMovies(data.results);
                setMovies(data.results);
                setPage(1);
                setHasMore(data.page < data.total_pages);
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

    useEffect(() => {
        filterMoviesByDate();
    }, [startYear, endYear, allMovies]);

    const filterMoviesByDate = () => {
        let filtered = [...allMovies];
        
        if (startYear) {
            filtered = filtered.filter(movie => {
                const releaseYear = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0;
                return releaseYear >= parseInt(startYear);
            });
        }
        
        if (endYear) {
            filtered = filtered.filter(movie => {
                const releaseYear = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0;
                return releaseYear <= parseInt(endYear);
            });
        }
        
        setMovies(filtered);
    };

    const handleSearch = async (e: any) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        if (loading) return;
        setLoading(true);
        try {
            const data = await searchMovies(searchQuery, 1);
            setAllMovies(data.results);
            setMovies(data.results);
            setPage(1);
            setHasMore(data.page < data.total_pages);
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
        getTrendingMovies(trendingPeriod, 1).then(data => {
            setAllMovies(data.results);
            setMovies(data.results);
            setPage(1);
            setHasMore(data.page < data.total_pages);
            setError(null);
        }).catch(err => {
            console.log(err);
            setError("Failed to load movies...");
        }).finally(() => {
            setLoading(false);
        });
    }

    const loadMoreMovies = async () => {
        if (!hasMore || loadingMore) return;
        
        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            let data;
            
            if (searchQuery.trim()) {
                data = await searchMovies(searchQuery, nextPage);
            } else {
                data = await getTrendingMovies(trendingPeriod, nextPage);
            }
            
            setAllMovies(prev => [...prev, ...data.results]);
            setPage(nextPage);
            setHasMore(data.page < data.total_pages);
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
                loadMoreMovies();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loadingMore, page, searchQuery, trendingPeriod]);

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
        <div className="filters-container">
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
            <div className="date-filter">
                <h3 className="filter-title">Filter by Release Year</h3>
                <div className="date-inputs">
                    <input
                        type="number"
                        placeholder="Start Year"
                        className="year-input"
                        value={startYear}
                        onChange={(e) => setStartYear(e.target.value)}
                        min="1900"
                        max="2100"
                    />
                    <span className="date-separator">to</span>
                    <input
                        type="number"
                        placeholder="End Year"
                        className="year-input"
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
                        min="1900"
                        max="2100"
                    />
                    {(startYear || endYear) && (
                        <button 
                            type="button" 
                            className="clear-filter-btn"
                            onClick={() => {
                                setStartYear("");
                                setEndYear("");
                            }}
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
            <div className="loading">Loading...</div>
        ) : (
            <>
                <div className="movies-grid">
                    {movies.map(movie => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
                {loadingMore && <div className="loading-more">Loading more movies...</div>}
            </>
        )}
    </div>
}

export default Home;