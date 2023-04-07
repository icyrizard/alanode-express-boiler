FROM postgis/postgis:14-3.3-alpine

# Variables needed at runtime to configure postgres and run the initdb scripts
ENV POSTGRES_DB ''
ENV POSTGRES_USER ''
ENV POSTGRES_PASSWORD ''

# Copy in the load-extensions script
COPY install-db-extensions.sh /docker-entrypoint-initdb.d/