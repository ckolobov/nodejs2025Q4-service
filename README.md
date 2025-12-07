# Home Library Service

A RESTful API service for managing a home music library built with NestJS. This service allows you to manage users, artists, albums, tracks, and favorites.

## Features

- **User Management**: Create, read, update, and delete users with password management
- **Artist Management**: Manage artists with Grammy award information
- **Album Management**: Organize albums with year and artist associations
- **Track Management**: Handle music tracks with artist and album references
- **Favorites**: Add/remove artists, albums, and tracks to/from favorites
- **Data Integrity**: Automatic cleanup of references when entities are deleted
- **OpenAPI Documentation**: Interactive API documentation via Swagger UI

## Prerequisites

- **Git** - [Download & Install Git](https://git-scm.com/downloads)
- **Node.js** - Version **>=22.14.0** - [Download & Install Node.js](https://nodejs.org/en/download/)
- **npm** - Comes with Node.js

## Installation

### 1. Clone the Repository

```bash
git clone {repository URL}
cd nodejs2025Q4-service
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables

The application uses environment variables stored in the `.env` file. A sample `.env.example` file is provided.

Copy the example file:
```bash
cp .env.example .env
```

Default configuration in `.env`:
```
PORT=4000

CRYPT_SALT=10
JWT_SECRET_KEY=secret123123
JWT_SECRET_REFRESH_KEY=secret123123
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h
```

**Configuration Options:**
- `PORT`: Server port (default: 4000)
- `CRYPT_SALT`: Salt rounds for bcrypt password hashing
- `JWT_SECRET_KEY`: Secret key for JWT token generation
- `JWT_SECRET_REFRESH_KEY`: Secret key for refresh token generation
- `TOKEN_EXPIRE_TIME`: Access token expiration time
- `TOKEN_REFRESH_EXPIRE_TIME`: Refresh token expiration time

## Running the Application

### Development Mode

Start the application in development mode with hot reload:

```bash
npm run start:dev
```

### Production Mode

Build and run the application in production mode:

```bash
npm run build
npm run start:prod
```

### Standard Mode

Start the application:

```bash
npm start
```

The application will start on the configured PORT (default: 4000).

## Running with Docker

### Prerequisites

- **Docker** - [Download & Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** - [Download & Install Docker Compose](https://docs.docker.com/compose/install/)

### Environment Configuration for Docker

Ensure your `.env` file is configured for Docker. Use the provided `.env.example` as a template:

```bash
cp .env.example .env
```

Important: For Docker, ensure `DB_HOST=database` in your `.env` file (not `localhost`).

### Development Mode with Docker

Start the application with PostgreSQL database in development mode:

```bash
docker-compose up
```

Run in detached mode (background):

```bash
docker-compose up -d
```

Stop the containers:

```bash
docker-compose down
```

Stop and remove volumes (clears database data):

```bash
docker-compose down -v
```

### Production Mode with Docker

Start the application in production mode:

```bash
docker-compose -f docker-compose.prod.yml up
```

Run in detached mode:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Stop the containers:

```bash
docker-compose -f docker-compose.prod.yml down
```

### Building Docker Images Individually

Build development image:

```bash
docker build -f Dockerfile.dev -t nodejs2025q4-service:dev .
```

Build production image:

```bash
docker build -f Dockerfile.prod -t nodejs2025q4-service:latest .
```

### Accessing the Application

Once running, the application will be available at:
- API: `http://localhost:4000`
- API Documentation: `http://localhost:4000/doc`

### Viewing Logs

View application logs:

```bash
docker-compose logs app
```

View database logs:

```bash
docker-compose logs database
```

Follow logs in real-time:

```bash
docker-compose logs -f app
```

## API Documentation

After starting the application, you can access the interactive OpenAPI (Swagger) documentation:

**URL**: `http://localhost:4000/doc`

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Interactive testing interface
- Authentication details

## API Endpoints

### Users (`/user`)

- `GET /user` - Get all users
- `GET /user/:id` - Get user by ID
- `POST /user` - Create new user
  ```json
  {
    "login": "username",
    "password": "password"
  }
  ```
- `PUT /user/:id` - Update user password
  ```json
  {
    "oldPassword": "currentPassword",
    "newPassword": "newPassword"
  }
  ```
- `DELETE /user/:id` - Delete user

### Artists (`/artist`)

- `GET /artist` - Get all artists
- `GET /artist/:id` - Get artist by ID
- `POST /artist` - Create new artist
  ```json
  {
    "name": "Artist Name",
    "grammy": false
  }
  ```
- `PUT /artist/:id` - Update artist
- `DELETE /artist/:id` - Delete artist (sets artistId to null in related albums/tracks)

### Albums (`/album`)

- `GET /album` - Get all albums
- `GET /album/:id` - Get album by ID
- `POST /album` - Create new album
  ```json
  {
    "name": "Album Name",
    "year": 2023,
    "artistId": "uuid-or-null"
  }
  ```
- `PUT /album/:id` - Update album
- `DELETE /album/:id` - Delete album (sets albumId to null in related tracks)

### Tracks (`/track`)

- `GET /track` - Get all tracks
- `GET /track/:id` - Get track by ID
- `POST /track` - Create new track
  ```json
  {
    "name": "Track Name",
    "artistId": "uuid-or-null",
    "albumId": "uuid-or-null",
    "duration": 180
  }
  ```
- `PUT /track/:id` - Update track
- `DELETE /track/:id` - Delete track

### Favorites (`/favs`)

- `GET /favs` - Get all favorites (returns full artist, album, and track objects)
- `POST /favs/artist/:id` - Add artist to favorites
- `DELETE /favs/artist/:id` - Remove artist from favorites
- `POST /favs/album/:id` - Add album to favorites
- `DELETE /favs/album/:id` - Remove album from favorites
- `POST /favs/track/:id` - Add track to favorites
- `DELETE /favs/track/:id` - Remove track from favorites

## Response Codes

- `200 OK` - Successful GET/PUT request
- `201 Created` - Successful POST request
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Invalid request data or invalid UUID
- `403 Forbidden` - Incorrect password
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Entity doesn't exist (when adding to favorites)

## Data Models

### User
```typescript
{
  id: string;          // UUID v4
  login: string;
  version: number;
  createdAt: number;   // timestamp
  updatedAt: number;   // timestamp
}
```

### Artist
```typescript
{
  id: string;          // UUID v4
  name: string;
  grammy: boolean;
}
```

### Album
```typescript
{
  id: string;          // UUID v4
  name: string;
  year: number;
  artistId: string | null;  // UUID v4
}
```

### Track
```typescript
{
  id: string;          // UUID v4
  name: string;
  artistId: string | null;  // UUID v4
  albumId: string | null;   // UUID v4
  duration: number;    // in seconds
}
```

### Favorites Response
```typescript
{
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
```

## Testing

### Run All Tests

Run all test suites:

```bash
npm test
```

### Run Specific Test Suite

Run a specific test file:

```bash
npm test -- users.e2e.spec.ts
npm test -- artists.e2e.spec.ts
npm test -- albums.e2e.spec.ts
npm test -- tracks.e2e.spec.ts
npm test -- favorites.e2e.spec.ts
```

### Run Tests with Authorization

Run all tests with authorization:

```bash
npm run test:auth
```

Run specific test suite with authorization:

```bash
npm run test:auth -- <path to suite>
```

### Test Coverage

Generate test coverage report:

```bash
npm run test:cov
```

## Code Quality

### Linting

Check and auto-fix code style issues:

```bash
npm run lint
```

### Formatting

Format code using Prettier:

```bash
npm run format
```

## Security Scanning

### Dependency Vulnerabilities

Check for known vulnerabilities in npm dependencies:

```bash
npm audit
```

Automatically fix vulnerabilities:

```bash
npm audit fix
```

### Docker Image Vulnerabilities

Scan application image for vulnerabilities:

```bash
npm run security:scan
```

Scan with only CRITICAL and HIGH severity issues:

```bash
npm run security:scan:critical
```

Scan filesystem for vulnerabilities, secrets, and misconfigurations:

```bash
npm run security:scan:fs
```

Generate JSON report:

```bash
npm run security:scan:json
```

Generate HTML report:

```bash
npm run security:scan:html
```

Generate SARIF report (for GitHub Code Scanning):

```bash
npm run security:scan:sarif
```

### Database Image Vulnerabilities

Scan database image for vulnerabilities:

```bash
npm run security:scan:db
```

Generate database scan JSON report:

```bash
npm run security:scan:db:json
```

Generate database scan HTML report:

```bash
npm run security:scan:db:html
```

Generate database scan SARIF report:

```bash
npm run security:scan:db:sarif
```