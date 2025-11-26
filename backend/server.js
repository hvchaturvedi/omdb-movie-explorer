// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { LRUCache } from "lru-cache";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const OMDB_KEY = process.env.OMDB_API_KEY;
if (!OMDB_KEY) {
  console.error(
    "Missing OMDB_API_KEY in environment. Copy .env.example -> .env and set OMDB_API_KEY"
  );
  process.exit(1);
}

const PORT = process.env.PORT || 4000;

// LRU cache: keep up to 200 items, TTL 1 hour
const cache = new LRUCache({
  max: 200,
  ttl: 1000 * 60 * 60,
});

// In-memory favorites store (simple, per-process). For production use DB.
const favorites = new Map();

function cacheKey(url) {
  return url;
}

async function fetchOmdb(params) {
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", OMDB_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const key = cacheKey(url.toString());
  const cached = cache.get(key);
  if (cached) return cached;

  const res = await fetch(url);
  const data = await res.json();

  // store in cache even if error — so we avoid spamming OMDB for repeating bad queries; adjust if needed
  cache.set(key, data);
  return data;
}

// REST endpoints

// Health
app.get("/api/health", (req, res) =>
  res.json({ ok: true, cachedSize: cache.size })
);

// Search
app.get("/api/search", async (req, res) => {
  try {
    const { title, page = "1" } = req.query;
    if (!title)
      return res.status(400).json({ error: "Missing title query parameter" });

    const data = await fetchOmdb({ s: title, page });
    // OMDB returns { Response: 'False', Error: 'Movie not found!' } sometimes
    if (data.Response === "False")
      return res.status(404).json({ error: data.Error });

    // Simplify response
    const results = (data.Search || []).map((item) => ({
      title: item.Title,
      year: item.Year,
      imdbID: item.imdbID,
      type: item.Type,
      poster: item.Poster === "N/A" ? null : item.Poster,
    }));

    return res.json({
      totalResults: data.totalResults || results.length,
      results,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Movie detail
app.get("/api/movie/:imdbID", async (req, res) => {
  try {
    const { imdbID } = req.params;
    const data = await fetchOmdb({ i: imdbID, plot: "full" });
    if (data.Response === "False")
      return res.status(404).json({ error: data.Error });
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Favorites (in-memory)
app.get("/api/favorites", (req, res) => {
  const list = Array.from(favorites.values());
  res.json(list);
});

app.post("/api/favorites", (req, res) => {
  const { imdbID, title, year, poster } = req.body;
  if (!imdbID) return res.status(400).json({ error: "imdbID required" });
  favorites.set(imdbID, { imdbID, title, year, poster });
  res.status(201).json({ ok: true });
});

app.delete("/api/favorites/:imdbID", (req, res) => {
  const { imdbID } = req.params;
  favorites.delete(imdbID);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`OMDB Proxy running on http://localhost:${PORT}`);
});
