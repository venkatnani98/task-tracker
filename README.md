# Task Tracker

A full-stack task management application built with React, Node.js/Express, and PostgreSQL, containerized with Docker.

## Quick Start

```bash
# Use BASH Terminal

git clone <your-repo-url>
cd task-tracker

# Copy environment variables
cp .env.example .env

# Start everything
docker compose up
```

Open **http://localhost:3000** in your browser.

> The first startup may take 1–2 minutes as Docker pulls images and installs dependencies.

## Running Tests

Tests run against the backend **without** needing Docker or a real database (the DB is mocked).

```bash
cd backend
npm install
npm test
```

Expected output: 11 passing tests across 4 test suites (GET, POST, PUT, DELETE).

## Project Structure

```
task-tracker/
├── backend/
│   ├── src/
│   │   ├── app.js          # Express app (routes, middleware)
│   │   ├── index.js        # Server entry point (DB init + listen)
│   │   ├── db/index.js     # PostgreSQL pool + schema creation
│   │   └── routes/tasks.js # All CRUD route handlers
│   ├── tests/tasks.test.js # Jest + Supertest integration tests
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Root component, state management
│   │   ├── api.js          # All fetch calls (one place)
│   │   ├── index.css       # Styles
│   │   └── components/
│   │       ├── TaskForm.jsx
│   │       ├── Filter.jsx
│   │       ├── TaskList.jsx
│   │       └── TaskItem.jsx
│   ├── nginx.conf          # Serves React + proxies /api to backend
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## API Endpoints

| Method | Path             | Description              |
|--------|-----------------|--------------------------|
| GET    | /api/tasks      | List all tasks           |
| GET    | /api/tasks?status=pending | Filter by status |
| POST   | /api/tasks      | Create a task            |
| PUT    | /api/tasks/:id  | Update a task            |
| DELETE | /api/tasks/:id  | Delete a task            |

## Design Choices & Trade-offs

**Single-file schema migration on startup.** Rather than a migration tool (Flyway, Liquibase, etc.), the backend runs `CREATE TABLE IF NOT EXISTS` on startup. This is simple and sufficient for a small app, but for production you'd want versioned migrations to handle schema changes safely.

**Mocked unit tests vs. integration tests.** The tests mock the PostgreSQL pool, so they're fast and run anywhere without a database. The trade-off is they don't test the actual SQL. A production setup would include a separate integration test suite that runs against a real test database in CI.

**React state lifted to App.jsx.** All server state (tasks list, loading, error) lives in the root component. For a larger app, this would move to a state management solution (Zustand, React Query) or Context. Kept simple here to stay readable.

**nginx as reverse proxy.** The frontend container uses nginx both to serve the React static files and to proxy `/api` requests to the backend. This avoids CORS issues in production and means the browser only talks to one origin. In development, Vite's dev server handles the proxy instead.

**No hardcoded secrets.** All database credentials come from environment variables. The `.env.example` file documents what's needed without exposing real values.