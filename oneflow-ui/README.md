# OneFlow UI

React + Vite + TypeScript frontend for OneFlow.

## Setup

1. Copy `.env.example` to `.env`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Development

The frontend runs on http://localhost:5173 and proxies API requests to http://localhost:3001.

## Features

- React Router for navigation
- TanStack Query for data fetching
- React Beautiful DnD for Kanban board
- Recharts for analytics charts
- JWT authentication with auto-refresh
- Role-based UI rendering

## Project Structure

- `src/components/` - Reusable components
- `src/pages/` - Page components
- `src/context/` - React context (Auth)
- `src/services/` - API service layer

