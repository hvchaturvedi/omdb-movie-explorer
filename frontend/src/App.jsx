import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar.jsx";
import ResultsGrid from "./components/ResultsGrid.jsx";
import MovieDetail from "./components/MovieDetail.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  // Load favorites from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("omdb_favs") || "[]");
    } catch {
      return [];
    }
  });

  // Save favorites
  useEffect(() => {
    localStorage.setItem("omdb_favs", JSON.stringify(favorites));
  }, [favorites]);

  // Search movies
  async function doSearch(title) {
    if (!title) return setResults([]);
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/search?title=${encodeURIComponent(title)}`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Load movie details
  async function openDetail(imdbID) {
    setSelected({ loading: true });

    const res = await fetch(`${API_BASE}/movie/${imdbID}`);
    const data = await res.json();
    setSelected(data);
  }

  // Toggle favorite movie
  function toggleFavorite(movie) {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.imdbID === movie.imdbID);
      if (exists) return prev.filter((m) => m.imdbID !== movie.imdbID);
      return [
        {
          imdbID: movie.imdbID,
          title: movie.title || movie.Title,
          year: movie.year || movie.Year,
          poster: movie.poster || movie.Poster,
        },
        ...prev,
      ];
    });
  }

  return (
    <div className="app container">
      <header className="header">
        <h1>OMDB Movie Explorer</h1>
        <p className="subtitle">Search movies & series using OMDB API</p>
      </header>

      <SearchBar
        onSearch={(q) => {
          setQuery(q);
          doSearch(q);
        }}
        defaultValue={query}
      />

      <main>
        <div className="layout">
          {/* Results */}
          <ResultsGrid
            results={results}
            loading={loading}
            onOpen={openDetail}
            onToggleFav={toggleFavorite}
            favorites={favorites}
          />

          {/* Sidebar */}
          <aside className="sidebar">
            <h3>Favorites</h3>

            {favorites.length === 0 ? (
              <p>No favorites yet</p>
            ) : (
              <ul className="fav-list">
                {favorites.map((f) => (
                  <li key={f.imdbID} onClick={() => openDetail(f.imdbID)}>
                    <img
                      src={
                        f.poster ||
                        "https://via.placeholder.com/60x90?text=No+Image"
                      }
                    />
                    <div>
                      <strong>{f.title}</strong>
                      <div>{f.year}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </main>

      {selected && (
        <MovieDetail
          movie={selected}
          onClose={() => setSelected(null)}
          onToggleFav={toggleFavorite}
          favorites={favorites}
        />
      )}

      <footer className="footer">
        <small>
          Backend running at <code>http://localhost:4000</code>
        </small>
      </footer>
    </div>
  );
}
