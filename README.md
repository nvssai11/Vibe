# Community Connection Platform

Lightweight community platform for apartment residents: React frontend + Express/Mongoose backend. This README summarizes setup, structure, key APIs, role-based access, and common tasks.

## Contents
- Backend: `backend/` (Express, ES modules, Mongoose)
- Frontend: `frontend/` (React SPA)
- Postman/Env: `CommunityPlatformEnv.json` (workspace environment values)
- Seed scripts, tests and linting configured in respective package.json files

## Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- Recommended: Git, VS Code

## Quick start

Backend
1. Open terminal:
   cd backend
2. Install dependencies:
   npm install
3. Create a `.env` (example variables):
   - MONGO_URI=mongodb://localhost:27017/community
   - JWT_SECRET=your_jwt_secret
   - PORT=5000
4. Seed sample data (optional):
   npm run seed
5. Run in dev:
   npm run dev
6. Run tests:
   npm test

Frontend
1. Open terminal:
   cd frontend
2. Install dependencies:
   npm install
3. Start dev server:
   npm start
4. Run tests/coverage:
   npm test

## Environment variables
Place secrets in `backend/.env`. Example:
MONGO_URI=...
JWT_SECRET=...
PORT=5000

The included `CommunityPlatformEnv.json` contains helpful REST client/Postman variables:
- baseUrl (e.g. http://localhost:5000)
- apartmentId, eventId, resourceId, userToken, adminToken, etc.

## Project structure (high-level)
- backend/
  - src/
    - models/ (Event.js, User.js, Apartment.js, Resource.js)
    - controllers/ (eventController.js, UserController.js, resourceController.js)
    - services/ (resourceService.js, ...)
    - middleware/ (auth, role checks)
    - config/db.js
    - seed/seed.js
    - server.js
- frontend/
  - src/
    - api/ (auth.api.js, resource.api.js)
    - context/ (AuthContext.jsx)
    - pages/ (Home, Resources, PeopleNearby, Register)
    - components/

## Role-based access control (RBAC)
The backend enforces RBAC using the authenticated user's role (stored on the User model and included in JWT payload). Common roles and typical permissions:

- resident
  - View public resources and events
  - Request resources
  - Join events
  - Create events (optional, depending on apartment policy)
  - Update own profile

- apartment_admin
  - All resident permissions
  - Create and manage apartment-level events
  - Approve/deny resource requests for their apartment
  - Manage apartment members (invite/remove)
  - Edit apartment settings and resources

- super_admin (or platform_admin)
  - Full access across apartments
  - Create/delete apartments
  - Manage users across the platform
  - Seed data and run administrative maintenance tasks

Implementation notes:
- User model should include a `role` field (string enum): `resident | apartment_admin | super_admin`.
- JWT issued at login includes user id and role; middleware populates `req.user`.
- Controllers use an authorization middleware that checks role membership before performing sensitive actions (approvals, user management, apartment changes).

Example usage (HTTP):
- Protected endpoint header:
  Authorization: Bearer <JWT_TOKEN>
- Endpoint-level protection:
  - POST /api/resources/:id/approve -> apartment_admin
  - POST /api/apartments -> super_admin
  - POST /api/events -> resident or apartment_admin (depending on policy)

## Key API endpoints (examples)
Base URL: http://localhost:5000 (adjust via .env)

Auth
- POST /auth/register — register user
- POST /auth/login — login -> returns JWT

Events
- POST /api/events — create event (auth required)
- GET /api/events/:apartmentId — list events for apartment

Resources
- GET /api/resources — list resources
- POST /api/resources — add resource (auth/role dependent)
- POST /api/resources/:id/request — request a resource
- POST /api/resources/:id/approve — approve a resource request (apartment_admin)

Example curl (login):
curl -X POST http://localhost:5000/auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password"}'

## Testing
- Backend tests: `npm test` in `backend/` (Jest + supertest)
- Frontend tests: `npm test` in `frontend/` (React Testing Library)

## Seed data
Backend seed script: `npm run seed` (creates sample users, apartment, resources). Update `seed/seed.js` as needed.

## .gitignore (recommended)
Add in repository root and backend/frontend:
- node_modules/
- .env
- coverage/
- build/ or dist/
- .vscode/

## Notes & pointers
- Authentication: JWT usage in controllers; secret in `.env`.
- Modify schemas in `backend/src/models/` and update controllers/services accordingly.
- Use the provided `CommunityPlatformEnv.json` for quick Postman/VS Code REST Client variable setup.

