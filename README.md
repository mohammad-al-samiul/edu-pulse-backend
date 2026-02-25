# Edu Pulse Backend

An Express + TypeScript REST API for an e-learning platform. It uses Prisma with MongoDB, JWT-based auth with refresh tokens, role-based access control, Redis caching, RabbitMQ for async events, and Socket.io for real-time notifications. Requests are validated with Zod, and global error handling is standardized.

## Tech Stack

- Node.js, Express, TypeScript
- Prisma ORM (MongoDB datasource)
- JWT auth (access + refresh)
- Role-based access control
- Upstash Redis (caching)
- RabbitMQ (event queue)
- Socket.io (real-time notifications)
- Zod (request validation), Express Rate Limit

## Prerequisites

- Node.js 18+ and npm
- MongoDB connection string
- RabbitMQ server URL
- Upstash Redis URL and token

## Environment

Create a `.env` file in the project root:

```
PORT=5000
DB_URL=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority

JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

REDIS_URL=https://your-upstash-url
REDIS_TOKEN=your-upstash-token

RABBITMQ_URL=amqp://user:pass@host:5672
```

## Install & Setup

- Install dependencies: `npm install`
- Generate Prisma client: `npx prisma generate` (runs automatically on install)
- Ensure MongoDB, RabbitMQ, and Redis are reachable with the provided envs

## Scripts

- Development: `npm run start:dev`
- Build: `npm run build`
- Production start: `npm run start`

The server listens on `PORT` and exposes the API under `/api/v1`.

## API Routes

Base path: `/api/v1`

- `/users` – register, login, refresh token, logout, user management (RBAC)
- `/categories` – create, list, update, delete (admin roles)
- `/courses` – create, list, get by id, update (instructor/admin)
- `/lessons` – create, mark complete (student/instructor)
- `/enrollments` – enroll student into course
- `/analytics` – summary, enrollment growth, top courses, revenue (admin roles)
- `/notifications` – list notifications for authenticated users

## Real-Time Notifications

Socket.io is initialized on server startup. Clients should connect and join with their user id to receive notifications:

```ts
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { withCredentials: true });
socket.emit("join", "<userId>");
socket.on("notification", (payload) => {
  console.log("Received notification:", payload);
});
```

## Development Notes

- CORS is configured to allow `http://localhost:3000` with credentials
- Requests are validated via Zod; errors flow through a global error handler
- Rate limiting is applied on the versioned router (`/api/v1`)
- Prisma schema is in `prisma/schema.prisma`; datasource uses `DB_URL`

## Project Scripts Summary

- `start:dev`: ts-node-dev with dotenv, runs `src/server.ts`
- `build`: `prisma generate` then TypeScript compile to `dist`
- `start`: runs compiled server `dist/server.js`

## License

ISC
