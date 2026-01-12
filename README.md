# Task Tracker

Simple internal tool to manage projects and tasks.

## Tech Stack
- Next.js
- TypeScript
- PostgreSQL
- CSS

## Setup Instructions
1. Clone the repository

2. Install dependencies
```bash
    npm install
```

3. Start PostgreSQL.
Make sure PostgreSQL is installed and running on your system.

4. Create database and tables
```bash
    # database creation
    createdb projects-db

    # schema
    psql projects-db < lib/db.sql
```

5. Create a .env.local file
```bash
    DATABASE_URL=postgresql://user:password@localhost:5432/projects-db
```

6. Start the project
```bash
    npm run dev
```

## Features
- Create and list projects
- Create tasks under projects
- Update task status
- Filter tasks by status
- Delete tasks

## Tradeoffs / Known Limitations
- No authentication
- No pagination for large task lists
- Basic error handling

## Technical Decisions
### Backend
- **PostgreSQL Connection Pool:** Used `pg` with connection pooling for database connections without use of ORMs.
- **Raw SQL Queries:** Used raw SQL for direct control over queries.

### Frontend
- **Dynamic Routes:** Used Next.js dynamic routing (`/tasks/[projectId]`) for better navigation.
- **Minimalistic UI:** Used basic CSS to focus on structure and development

## Improvements With More Time
- Add pagination
- Add basic authentication
- Add optimistic UI updates
- Add tests
- Better error handling (toast notifications)
- Full CRUD operations for Projects (currently only create and list)