# OneFlow API

Express + TypeScript + Sequelize backend for OneFlow.

## Setup

1. Copy `.env.example` to `.env` and fill in the values
2. Install dependencies: `npm install`
3. Run migrations: `npm run migrate`
4. Seed data: `npm run seed`
5. Start development server: `npm run dev`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration
- `npm run seed` - Run seeders
- `npm run seed:undo` - Undo seeders

## Database

The API uses Sequelize with MySQL. Migrations are stored in `src/migrations/` and seeders in `src/seeders/`.

## API Structure

- `src/controllers/` - Request handlers
- `src/models/` - Sequelize models
- `src/routes/` - API routes
- `src/middleware/` - Auth and error handling middleware
- `src/validators/` - Input validation
- `src/utils/` - Utility functions (JWT, etc.)

## Authentication

JWT-based authentication with access tokens and refresh tokens. Tokens are stored in memory (use Redis in production).

## Testing

Run tests with `npm test`. Test files are in `src/__tests__/`.

