import './css/App.css'
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import { MovieProvider } from './Contexts/MovieContext';
import {Routes, Route} from 'react-router-dom';
import NavBar from './components/NavBar';

function App() {

  return (
    <MovieProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path='/Movie-Search-Project' element={<Home />} />
          <Route path='/Movie-Search-Project/favorites' element={<Favorites />} />
        </Routes>
      </main>
    </MovieProvider>
  )
}

export default App
