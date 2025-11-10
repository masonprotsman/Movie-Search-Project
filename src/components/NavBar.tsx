import { Link } from "react-router-dom";
import '../css/NavBar.css';

function NavBar() {
    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/Movie-Search-Project">Movie Searcher</Link>
        </div>
        <div className="navbar-links">
            <Link to="/Movie-Search-Project" className="nav-links">Home</Link>
            <Link to="/Movie-Search-Project/favorites" className="nav-links">Favorites</Link>
        </div>
    </nav>
}

export default NavBar;