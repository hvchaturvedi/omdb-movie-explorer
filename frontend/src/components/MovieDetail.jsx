import React from "react";

export default function MovieDetail({
  movie,
  onClose,
  onToggleFav,
  favorites,
}) {
  if (!movie) return null;

  const isFav = favorites.some((f) => f.imdbID === movie.imdbID);

  if (movie.loading)
    return (
      <div className="modal">
        <div className="modal-body">Loading...</div>
      </div>
    );

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>
          ×
        </button>

        <div className="detail-grid">
          <img
            src={
              movie.Poster === "N/A"
                ? "https://via.placeholder.com/300x450?text=No+Image"
                : movie.Poster
            }
          />

          <div>
            <h2>
              {movie.Title} <small>({movie.Year})</small>
            </h2>

            <p>
              <strong>Director:</strong> {movie.Director}
            </p>
            <p>
              <strong>Actors:</strong> {movie.Actors}
            </p>
            <p>
              <strong>Genre:</strong> {movie.Genre}
            </p>
            <p>
              <strong>Plot:</strong> {movie.Plot}
            </p>

            <p>
              <strong>Ratings:</strong>
            </p>
            <ul>
              {movie.Ratings?.map((r) => (
                <li key={r.Source}>
                  {r.Source}: {r.Value}
                </li>
              ))}
            </ul>

            <div className="detail-actions">
              <button
                onClick={() =>
                  onToggleFav({
                    imdbID: movie.imdbID || movie.imdbID,
                    title: movie.Title,
                    year: movie.Year,
                    poster: movie.Poster,
                  })
                }
              >
                {isFav ? "Remove Favorite" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
