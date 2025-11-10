import '../css/Favorites.css';
import { useMovieContext } from '../Contexts/MovieContext';
import MovieCard from '../components/MovieCard';

function Favorites() {
    const { favorites } = useMovieContext();

    if (favorites) {
        return (
            <div className="favorites">
                <h2>Your Favorites</h2>
                <div className="movies-grid">
                    {favorites.map((movie: any) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            </div>

        )
    }

    return <div className="favorites-empty">
        <h2>Your Favorite Movies</h2>
        <p>You have no favorite movies yet.</p>
    </div>
}

export default Favorites;