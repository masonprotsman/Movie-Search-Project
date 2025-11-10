import '../css/MovieCard.css';
import { useMovieContext } from '../Contexts/MovieContext';
import type { MouseEvent } from 'react';
function MovieCard({ movie }: { movie: any }) {
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext() as {
        isFavorite: (id: number) => boolean;
        addToFavorites: (movie: any) => void;
        removeFromFavorites: (id: number) => void;
    };
    const favorite = isFavorite(movie.id);

    function toggleFavorite(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        if (favorite) {
            removeFromFavorites(movie.id);
        } else {
            addToFavorites(movie);
        }
    }
    return <div className="movie-card">
        <div className="movie-poster">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <div className="movie-overlay">
                <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={toggleFavorite}>♥</button>
            </div>
        </div>
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.release_date.split("-")[0]}</p>
        </div>
    </div>
}

export default MovieCard;