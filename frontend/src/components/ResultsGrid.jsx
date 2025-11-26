import React from "react";

export default function ResultsGrid({
  results,
  loading,
  onOpen,
  onToggleFav,
  favorites,
}) {
  const favIds = new Set(favorites.map((f) => f.imdbID));

  if (loading) return <div className="loading">Loading...</div>;
  if (!results || results.length === 0)
    return <div className="empty">No results</div>;

  return (
    <div className="results-grid">
      {results.map((item) => (
        <div className="card" key={item.imdbID}>
          <img
            src={
              item.poster || "https://via.placeholder.com/200x300?text=No+Image"
            }
            alt={item.title}
            onClick={() => onOpen(item.imdbID)}
          />

          <div className="card-body">
            <h4 onClick={() => onOpen(item.imdbID)}>{item.title}</h4>
            <div className="meta">
              {item.year} • {item.type}
            </div>

            <div className="actions">
              <button onClick={() => onOpen(item.imdbID)}>Details</button>
              <button onClick={() => onToggleFav(item)}>
                {favIds.has(item.imdbID) ? "Unfav" : "Fav"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
