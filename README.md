# Medication Reminder Project

A web application to help patients manage their medications and allow caretakers to set reminders. Built with **React + Vite** for the frontend and **Supabase** as the backend.

---

## Features

- User authentication (Signup/Login) via Supabase
- Caretaker support: Add medications for patients
- Medication management: Add, view, and update medications
- Daily notifications for medication reminders
- Responsive UI using React

---

## Tech Stack

- **Frontend:** React 18, Vite, React Router, Axios
- **Backend:** Supabase (Auth, Database)
- **Notifications:** Scheduled via reminder times
- **Styling:** Tailwind CSS / Your CSS framework

---

## Project Structure
medication-reminder/
├── public/ # Static assets
├── src/
│ ├── components/ # React components
│ ├── pages/ # Pages (Dashboard, Signup, Login)
│ ├── services/ # API calls (Supabase)
│ ├── hooks/ # Custom React hooks
│ └── App.tsx
├── .env.example # Example environment variables
├── package.json
├── vite.config.ts
└── README.md

## Setup & Installation

1. **Clone the repository**

```bash
git clone https://github.com/<your-username>/medication-reminder.git
cd medication-reminder
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

-  Copy .env.example to .env:
```bash
cp .env.example .env
```

Fill in your Supabase credentials:
```bash
VITE_SUPABASE_URL=https://your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Run the app locally**
```bash
npm run dev
```

- App will be available at http://localhost:5173 (or the port shown in console)

## Deployment

- The frontend can be deployed to Vercel.
- Use npm run build to create the production build.
- Set the same environment variables in Vercel as in .env.


## Usage

1. Signup/Login as a patient or caretaker.

2. Add medications via dashboard.

3. Set reminder times (optional) for notifications.

4. Caretakers can add medications for patients.