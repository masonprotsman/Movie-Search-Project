import { createContext, useState, useContext, useEffect } from "react";

interface Movie {
    id: number;
    [key: string]: any;
}

interface MovieContextType {
    favorites: Movie[];
    addToFavorites: (movie: Movie) => void;
    removeFromFavorites: (movieId: number) => void;
    isFavorite: (movieId: number) => boolean;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovieContext = () => {
    const context = useContext(MovieContext);
    if (!context) {
        throw new Error("useMovieContext must be used within a MovieProvider");
    }
    return context;
};

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<Movie[]>([]);

    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites");
        if (storedFavs) {
            setFavorites(JSON.parse(storedFavs));
        }
    }, []);
    
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (movie: Movie) => {
        setFavorites((prev) => [...prev, movie]);
    };

    const removeFromFavorites = (movieId: number) => {
        setFavorites((prev) => prev.filter(movie => movie.id !== movieId));
    };

    const isFavorite = (movieId: number) => {
        return favorites.some(movie => movie.id === movieId);
    };

    const value: MovieContextType = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    };

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
};