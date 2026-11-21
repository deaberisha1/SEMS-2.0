# SEMS 2.0 — Student Portal

Web application for the University of Prishtina student portal, built from the SEMS 2.0 UI/UX design.

**Tech stack**

| Part | Technology |
|---|---|
| Frontend | React 18 (JavaScript / JSX), React Router, Vite |
| Styling | Plain CSS — one stylesheet per component + global design tokens |
| Backend | Node.js + Express 5 (REST API) |
| Data | MongoDB Atlas with Mongoose |

---

## Requirements

- Node.js 20.19 or newer
- A MongoDB Atlas database

---

## How to run

```bash
npm install          # root dependencies (concurrently)
npm run setup        # installs server and client dependencies
```

Copy `server/.env.example` to `server/.env` and fill in `MONGODB_URI`.

```bash
npm run seed --prefix server   # seed the database with demo data
npm run dev                    # starts the API server and the React app together
```

Then open **http://localhost:5173**

| Demo account | ID | Password |
|---|---|---|
| Student | `111` | `student123` |
| Professor | `000` | `profesor123` |

Reset demo data:

```bash
npm run seed --prefix server -- --reset
```

---

## Tests

The server must be running. Then:

```bash
npm test --prefix server
```

To test against another server, set `BASE_URL`:

```bash
BASE_URL=https://your-app.onrender.com npm test --prefix server
```

---

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URI` | yes | — | MongoDB Atlas connection string |
| `PORT` | no | `4000` | Render sets this automatically |
| `SESSION_DAYS` | no | `7` | How many days a login token stays valid |
| `NODE_ENV` | no | — | Set to `production` on Render |
| `TRUST_PROXY` | no | `1` in production | Express trust proxy setting |
| `DEFAULT_PROFESSOR_ID` | no | `000` | Fallback professor for non-academic requests |

---

## Production

```bash
npm run render-build   # installs dependencies and builds the client
npm start              # serves the built React app + API on one port
```

Open **http://localhost:4000**

**Live:** _https://YOUR-APP.onrender.com_

---

## Project structure

```
sems2.0/
├── package.json              # scripts that run client + server together
├── scripts/setup.mjs         # installs server and client dependencies
├── client/                   # React frontend (Vite)
│   ├── index.html
│   ├── vite.config.js        # forwards /api requests to the Node server
│   └── src/
│       ├── main.jsx          # entry point
│       ├── api.js            # fetch helper + login / logout
│       └── app/
│           ├── App.jsx       # login → load data → show the app
│           ├── routes.jsx    # all page URLs
│           ├── components/   # Sidebar, MainLayout, SmartSearch
│           ├── context/      # Theme, Role, Accessibility
│           ├── data/         # student.js / professor.js — data loaded from the API
│           └── pages/        # one .jsx + one .css per page
│               └── professor/
└── server/                   # Node.js + Express backend
    ├── env.js                # loads .env before other imports
    ├── index.js              # creates the app, mounts routes
    ├── db.js                 # connects to MongoDB
    ├── models/               # Mongoose schemas
    ├── middleware/            # auth, rate limiting, validation
    ├── routes/
    │   ├── auth.js           # login, logout, me, change-password
    │   ├── student.js        # student data, consultations, requests, certificates, profile
    │   └── professor.js      # professor data, requests, assessments, grades, profile
    ├── scripts/seed.js       # seeds the database from data/*.json
    ├── tests/api.test.js     # 14 API tests (node --test)
    └── data/                 # seed data (users, student, professor, consultations)
```

---

## API

| Method | URL | Who | Description |
|---|---|---|---|
| POST | `/api/auth/login` | everyone | `{ id, password }` → `{ token, user }` |
| GET | `/api/auth/me` | logged in | current user |
| POST | `/api/auth/logout` | logged in | end session |
| POST | `/api/auth/change-password` | logged in | `{ currentPassword, newPassword }` |
| GET | `/api/student/data` | student | exams, grades, transcript, schedule, courses, payments, attendance, consultations |
| POST | `/api/student/consultations` | student | book a consultation `{ prof, subject, date, slot, room, reason }` |
| DELETE | `/api/student/consultations/:id` | student | cancel a booking |
| GET | `/api/student/requests` | student | my requests |
| POST | `/api/student/requests` | student | new request `{ type, details }` |
| GET | `/api/student/certificates` | student | my certificates |
| POST | `/api/student/certificates` | student | generate a certificate `{ lloji, gjuha, arsyeja }` |
| PATCH | `/api/student/profile` | student | update personal info `{ emailPersonal, telefon, adresa }` |
| GET | `/api/professor/data` | professor | profile, courses, students, requests, schedule |
| GET | `/api/professor/requests` | professor | requests assigned to this professor |
| PATCH | `/api/professor/requests/:id` | professor | `{ status: "Aprovuar" \| "Refuzuar", note }` |
| GET | `/api/professor/assessments?courseId=` | professor | continuous assessment rows for a course |
| POST | `/api/professor/assessments` | professor | save assessment rows `{ courseId, rows }` |
| GET | `/api/professor/grades?courseId=` | professor | published grades for a course |
| POST | `/api/professor/grades` | professor | publish grades `{ courseId, grades }` |
| PATCH | `/api/professor/profile` | professor | update personal info `{ emailPersonal, phone, office, consultations }` |
| GET | `/api/health` | everyone | `{ status, db }` |
