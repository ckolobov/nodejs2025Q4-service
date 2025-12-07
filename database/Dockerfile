# Use official PostgreSQL image
FROM postgres:17-alpine

# Set environment variables (these can be overridden by docker-compose or docker run)
ENV POSTGRES_DB=home_library
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Expose PostgreSQL default port
EXPOSE 5432

# The official postgres image already handles initialization
# Additional init scripts can be placed in /docker-entrypoint-initdb.d/
