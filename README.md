# Todo Server (Node.js + TypeScript + PostgreSQL)

Backend service for user management and TodoList data management.

## Tech Stack
- Node.js + TypeScript (ES6 syntax)
- Express
- PostgreSQL via `pg`
- Authentication via JWT (`jsonwebtoken`) and password hashing (`bcryptjs`)

## Getting StartedV

### 1. Configure Environment
Create a `.env` file based on `.env.example`:

```
PORT=3000
JWT_SECRET=replace_me_with_a_secure_random_string
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_app
```

### 2. Install Dependencies
```
npm install
```

### 3. Run in Development
```
npm run dev
```
The server initializes the database tables on startup and listens on `http://localhost:3000`.

### 4. Build & Start
```
npm run build
npm start
```

## API

### Health
- `GET /health` → `{ status: "ok" }`

### Auth
- `POST /auth/signup` → body `{ email, password, name? }` → returns `{ token }`
- `POST /auth/login` → body `{ email, password }` → returns `{ token }`

### Users
- `GET /users/me` → header `Authorization: Bearer <token>` → returns user profile

### Todos (require auth)
- `GET /todos` → list all todos for current user
- `POST /todos` → body `{ title, description? }` → create
- `GET /todos/:id` → fetch single
- `PUT /todos/:id` → body `{ title?, description?, completed? }` → update
- `DELETE /todos/:id` → delete

## Notes
- UUIDs are generated in the server (`crypto.randomUUID`) to avoid Postgres extensions.
- Tables are auto-created on startup if they don't exist.
- Use `DATABASE_URL` or `POSTGRES_URL` for the connection string.