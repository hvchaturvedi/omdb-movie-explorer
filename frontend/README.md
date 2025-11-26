omdb-movie-explorer/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── package.json
│   └── ...
│
└── README.md
Backend (Node.js + Express)

The backend is a proxy service that securely connects to the OMDB API.

Features

Fetch movie results from OMDB API

Secure API key handling (stored in .env)

REST API endpoints

LRU in-memory caching (max size + TTL expiry)

Works locally (http://localhost:4000)

Endpoints
Endpoint	            Description
/api/search?title=...	Search movies or series by title
/api/movie/:id	        Get full movie details
/api/health	            Health & cache status

Setup
cd backend
cp .env.example .env   # Add OMDB_API_KEY here
npm install
npm start


Backend will start at:

http://localhost:4000

🎨 Frontend (React + Vite)

A clean, responsive UI built using React.

Features

Search movies & series

Display results in grid view

View full movie details (modal)

Add/remove favorites (saved in localStorage)

Responsive layout

Connected to backend API

Setup
cd frontend
npm install
npm run dev


Frontend will start at:

http://localhost:5173

Tech Stack

Backend

Node.js

Express

LRU-Cache

node-fetch

dotenv

Frontend

React

Vite

Fetch API

CSS (custom)