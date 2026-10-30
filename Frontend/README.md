# SocietyFix — Frontend Demo

## Run locally
1. Extract this folder and open it in VS Code.
2. Open a terminal in the folder containing `package.json`.
3. Run `npm install`.
4. Run `npm run dev`.

## Current implementation
- React + Vite frontend. Tailwind CSS v3 is configured in `tailwind.config.js`, `postcss.config.js`, and `src/index.css`; dependencies are declared in `package.json`.
- Signup accounts, sessions, staff records, and complaints use browser `localStorage`. They are not saved to a server/database.
- Resident complaint edit/delete, shared complaint search, staff contact creation, complaint assignment and full complaint detail display are included in the demo.
- Forgot-password is a local demo flow only. The generated OTP is displayed on screen for testing; it is **not** sent by email or SMS. Real OTP delivery requires a backend and configured email/SMS providers.

## Security note
This is not production authentication. Passwords are stored in browser localStorage and role selection is not secure authorization. Do not use real passwords or deploy this demo with real residents' data. Production use requires backend authentication, password hashing, server-side role authorization, a database, and an email/SMS OTP service.
