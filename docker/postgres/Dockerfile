# PostgreSQL runtime with initial SQL for todo_app
FROM postgres:16-alpine

# Default database and superuser credentials (override at runtime if needed)
ENV POSTGRES_DB=todo_app
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Copy initialization SQL into entrypoint init directory
# Files in this directory run on first container start (when data dir is empty)
COPY ./init.sql /docker-entrypoint-initdb.d/01-init.sql

EXPOSE 5432