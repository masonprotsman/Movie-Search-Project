import '../css/MovieCard.css';
import { useMovieContext } from '../Contexts/MovieContext';
import { useState, type MouseEvent } from 'react';
import { getMovieDetails } from '../services/api';

function MovieCard({ movie }: { movie: any }) {
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext() as {
        isFavorite: (id: number) => boolean;
        addToFavorites: (movie: any) => void;
        removeFromFavorites: (id: number) => void;
    };
    const favorite = isFavorite(movie.id);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [movieDetails, setMovieDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const [showTickets, setShowTickets] = useState(false);

    function toggleFavorite(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        if (favorite) {
            removeFromFavorites(movie.id);
        } else {
            addToFavorites(movie);
        }
    }

    async function openDialog() {
        setIsDialogOpen(true);
        setIsLoading(true);
        try {
            const details = await getMovieDetails(movie.id);
            setMovieDetails(details);
        } catch (error) {
            console.error("Failed to fetch movie details:", error);
        } finally {
            setIsLoading(false);
        }
    }

    function closeDialog() {
        setIsDialogOpen(false);
        setMovieDetails(null);
        setShowTrailer(false);
        setShowTickets(false);
    }

    function openTrailer() {
        setShowTrailer(true);
    }

    function closeTrailer(e?: MouseEvent<HTMLDivElement | HTMLButtonElement>) {
        e?.stopPropagation();
        setShowTrailer(false);
    }

    function openTickets() {
        setShowTickets(true);
    }

    function closeTickets(e?: MouseEvent<HTMLDivElement | HTMLButtonElement>) {
        e?.stopPropagation();
        setShowTickets(false);
    }

    return (
        <>
            <div className="movie-card" onClick={openDialog}>
                <div className="movie-poster">
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                    <div className="movie-overlay">
                        <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={toggleFavorite}>♥</button>
                    </div>
                    {movie.vote_average > 0 && (
                        <div className="rating-circle">
                            <svg className="rating-ring" width="50" height="50">
                                <circle
                                    className="rating-ring-background"
                                    stroke="#444"
                                    strokeWidth="3"
                                    fill="transparent"
                                    r="20"
                                    cx="25"
                                    cy="25"
                                />
                                <circle
                                    className="rating-ring-progress"
                                    stroke={movie.vote_average >= 7 ? "#21d07a" : movie.vote_average >= 5 ? "#d2d531" : "#db2360"}
                                    strokeWidth="3"
                                    fill="transparent"
                                    r="20"
                                    cx="25"
                                    cy="25"
                                    strokeDasharray={`${(movie.vote_average / 10) * 125.6} 125.6`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 25 25)"
                                />
                            </svg>
                            <span className="rating-score">{movie.vote_average.toFixed(1)}</span>
                        </div>
                    )}
                </div>
                <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>{movie.release_date?.split("-")[0]}</p>
                </div>
            </div>

            {isDialogOpen && (
                <div className="movie-dialog-overlay" onClick={closeDialog}>
                    <div className="movie-dialog" onClick={(e) => e.stopPropagation()}>
                        <button className="dialog-close" onClick={closeDialog}>×</button>
                        {isLoading ? (
                            <div className="dialog-loading">Loading details...</div>
                        ) : (
                            <div className="dialog-content">
                                <img 
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                    alt={movie.title}
                                    className="dialog-poster"
                                />
                                <div className="dialog-details">
                                    <div className="dialog-header">
                                        <div className="dialog-title-row">
                                            <h2>{movie.title}</h2>
                                            {movie.vote_average > 0 && (
                                                <div className="rating-circle dialog-rating">
                                                    <svg className="rating-ring" width="60" height="60">
                                                        <circle
                                                            className="rating-ring-background"
                                                            stroke="#444"
                                                            strokeWidth="4"
                                                            fill="transparent"
                                                            r="24"
                                                            cx="30"
                                                            cy="30"
                                                        />
                                                        <circle
                                                            className="rating-ring-progress"
                                                            stroke={movie.vote_average >= 7 ? "#21d07a" : movie.vote_average >= 5 ? "#d2d531" : "#db2360"}
                                                            strokeWidth="4"
                                                            fill="transparent"
                                                            r="24"
                                                            cx="30"
                                                            cy="30"
                                                            strokeDasharray={`${(movie.vote_average / 10) * 150.8} 150.8`}
                                                            strokeLinecap="round"
                                                            transform="rotate(-90 30 30)"
                                                        />
                                                    </svg>
                                                    <span className="rating-score">{movie.vote_average.toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>
                                        {movieDetails?.tagline && (
                                            <p className="dialog-tagline">"{movieDetails.tagline}"</p>
                                        )}
                                        <div className="dialog-actions">
                                            <button 
                                                onClick={openTickets}
                                                className="tickets-link"
                                            >
                                                Get Tickets
                                            </button>
                                            {movieDetails?.videos?.results && movieDetails.videos.results.length > 0 && (
                                                <>
                                                    {movieDetails.videos.results.find((v: any) => v.type === "Trailer" && v.site === "YouTube") && (
                                                        <button 
                                                            onClick={openTrailer}
                                                            className="trailer-link"
                                                        >
                                                            Watch Trailer
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            <button 
                                                onClick={(e) => toggleFavorite(e)}
                                                className={`favorite-dialog-btn ${favorite ? "active" : ""}`}
                                            >
                                                {favorite ? "♥ Remove from Favorites" : "♥ Add to Favorites"}
                                            </button>
                                        </div>
                                        <p className="dialog-overview">
                                            <strong>Overview:</strong><br />
                                            {movie.overview || "No overview available."}
                                        </p>
                                    </div>
                                    <div className="dialog-info-grid">
                                        <p className="dialog-release-date">
                                            <strong>Release Date:</strong> {movie.release_date}
                                        </p>
                                        <p className="dialog-rating">
                                            <strong>Rating:</strong> {movie.vote_average?.toFixed(1)}/10
                                        </p>
                                        {movieDetails?.runtime && (
                                            <p className="dialog-runtime">
                                                <strong>Runtime:</strong> {movieDetails.runtime} minutes
                                            </p>
                                        )}
                                        {movieDetails?.budget > 0 && (
                                            <p className="dialog-budget">
                                                <strong>Budget:</strong> ${(movieDetails.budget / 1000000).toFixed(1)}M
                                            </p>
                                        )}
                                        {movieDetails?.revenue > 0 && (
                                            <p className="dialog-revenue">
                                                <strong>Revenue:</strong> ${(movieDetails.revenue / 1000000).toFixed(1)}M
                                            </p>
                                        )}
                                        {movieDetails?.genres && movieDetails.genres.length > 0 && (
                                            <p className="dialog-genres">
                                                <strong>Genres:</strong> {movieDetails.genres.map((g: any) => g.name).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                    {movieDetails?.credits?.cast && movieDetails.credits.cast.length > 0 && (
                                        <div className="dialog-cast">
                                            <strong>Cast:</strong>
                                            <div className="cast-list">
                                                {movieDetails.credits.cast.slice(0, 5).map((actor: any) => (
                                                    <span key={actor.id} className="cast-member">
                                                        {actor.name} <span className="cast-character">as {actor.character}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {movieDetails?.credits?.crew && (
                                        <>
                                            {movieDetails.credits.crew.find((c: any) => c.job === "Director") && (
                                                <p className="dialog-director">
                                                    <strong>Director:</strong> {movieDetails.credits.crew.find((c: any) => c.job === "Director").name}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showTrailer && movieDetails?.videos?.results && (
                <div className="trailer-overlay" onClick={closeTrailer}>
                    <div className="trailer-popup" onClick={(e) => e.stopPropagation()}>
                        <button className="trailer-close" onClick={closeTrailer}>×</button>
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${movieDetails.videos.results.find((v: any) => v.type === "Trailer" && v.site === "YouTube")?.key}?autoplay=1`}
                            title="Movie Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {showTickets && (
                <div className="tickets-overlay" onClick={closeTickets}>
                    <div className="tickets-popup" onClick={(e) => e.stopPropagation()}>
                        <button className="tickets-close" onClick={closeTickets}>×</button>
                        <div className="tickets-content">
                            <h2 className='tickets'>Get Tickets</h2>
                            <h3 className='title'>{movie.title}</h3>
                            <div className="ticket-links">
                                <a 
                                    href={`https://www.fandango.com/search?q=${encodeURIComponent(movie.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ticket-provider"
                                >
                                    Fandango
                                </a>
                                <a 
                                    href={`https://www.atom.com/search?query=${encodeURIComponent(movie.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ticket-provider"
                                >
                                    Atom Tickets
                                </a>
                                <a 
                                    href={`https://www.movietickets.com/search?query=${encodeURIComponent(movie.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ticket-provider"
                                >
                                    MovieTickets.com
                                </a>
                                <a 
                                    href={`https://www.google.com/search?q=${encodeURIComponent(movie.title + ' movie tickets near me')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ticket-provider"
                                >
                                    Google Search
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default MovieCard;