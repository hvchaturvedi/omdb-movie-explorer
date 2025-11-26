import React, { useState } from "react";

export default function SearchBar({ onSearch, defaultValue = "" }) {
  const [q, setQ] = useState(defaultValue);

  function submit(e) {
    e.preventDefault();
    onSearch(q.trim());
  }

  return (
    <form className="searchbar" onSubmit={submit}>
      <input
        placeholder="Search movies or series..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
