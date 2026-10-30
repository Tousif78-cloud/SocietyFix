# SocietyFix Backend

Express API used by the React + Vite frontend. The current adapter uses a persistent JSON file at `Backend/data/societyfix-store.json`; it is no longer RAM-only, so users, sessions, complaints, history, and notifications survive a page refresh and normal backend restarts. This is a local-development adapter, not a production database. MongoDB is **not connected** in this source tree.

## Run

1. Install Node.js 18+.
2. Terminal 1: `cd Backend`, `npm install`, `cp .env.example .env`, `npm run dev`.
3. Terminal 2: `cd Frontend`, `npm install`, `npm run dev`.
4. Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

API health check: `http://localhost:5000/api/health`.

## Roles and access

- Public signup creates a Resident account.
- The first login selecting Admin can bootstrap the first Admin if no active Admin exists. This should only be used during initial local setup.
- Once an Admin exists, new Staff and additional Admin requests are saved as Pending and shown in the Admin dashboard's **Access requests** panel.
- Admin can approve or deny requests. An approved Staff account can then log in as Staff; a second Admin requires an existing Admin's approval.
- Selecting a role different from an existing account's role no longer silently changes the role or routes the user to Resident. The account must have the approved role.

## Live updates and persistence

The signed-in frontend refreshes complaints and staff data every five seconds, so residents, staff, and admins see complaint creation, assignment, progress, and resolution without manually refreshing. Staff work updates generate Admin notifications. JSON persistence is intended for local testing only; use a real database and secure session store before deployment.

## API overview

- `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, `POST /api/v1/auth/logout`
- `GET/POST /api/v1/complaints`, `GET /api/v1/complaints/:id`, `PATCH /api/v1/complaints/:id`
- `GET/POST /api/v1/staff`, `PUT /api/v1/staff/bulk`
- `GET /api/v1/notifications`, `PATCH /api/v1/notifications/:id/read`, `PATCH /api/v1/notifications/read-all`
- `GET /api/v1/admin/users`, `GET /api/v1/admin/access-requests`, `PATCH /api/v1/admin/access-requests/:id`

Complaint photos are accepted as data URLs for now. Use a real database, secure session store, and file-storage adapter before production deployment.
