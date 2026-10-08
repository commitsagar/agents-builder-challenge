# Production Container for Google Cloud Run
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend, GCP connectors, and agents
COPY backend/ /app/backend/
COPY database/ /app/database/
COPY gcp/ /app/gcp/
COPY adk_agents/ /app/adk_agents/
COPY dist/ /app/dist/

ENV PORT=8080
ENV GCP_PROJECT=aistudio-499215

EXPOSE 8080

# Cloud Run binds to $PORT
CMD exec uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}
