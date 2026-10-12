# SkillGap Frontend

React 18 and JavaScript single-page application built with Vite. The frontend
uses the Spring Boot API for authentication and application data.

## Requirements

- Node.js 18 or newer
- The SkillGap Spring Boot backend running at `http://localhost:8081`

## Run locally

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:5173`. Set `VITE_API_URL` in `.env` if the backend API
is hosted at a different URL. Do not commit `.env`; it is ignored by Git.

To build the production frontend:

```powershell
npm run build
```

The demo student account is `demo.student@skillgap.com` with password
`Student@123`, provided the backend has seeded it in the connected database.
