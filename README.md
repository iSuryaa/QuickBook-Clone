# QuickBook — Appointment Booking App

A full-featured mobile-first appointment booking app built with React + Vite + Tailwind CSS.

## Features

- Browse businesses: hospitals, salons, cinemas, gyms, restaurants, hotels
- Book appointments with service + specialist + date/time selection
- Cinema seat picker with Recliner / Premium / Standard categories
- Live queue tracker for hospitals and salons
- Favourites, booking history, notifications
- Platform fee of ₹29 per booking (service price paid at venue)

---

## Getting Started on Windows

### Prerequisites

1. **Node.js** (v18 or later)
   - Download from [https://nodejs.org](https://nodejs.org)
   - Choose the **LTS** version and run the installer
   - After install, open **Command Prompt** or **PowerShell** and verify:
     ```
     node --version
     npm --version
     ```

2. **pnpm** (package manager)
   - Install via npm:
     ```
     npm install -g pnpm
     ```
   - Verify:
     ```
     pnpm --version
     ```

---

### Installation

1. **Clone or download** this project, then open a terminal in the project root folder.

2. **Install dependencies:**
   ```
   pnpm install
   ```

---

### Running the App

```
pnpm --filter @workspace/quickbook run dev
```

Then open your browser and go to:

```
http://localhost:21933
```

> **Note:** The port number is shown in the terminal output after startup.

---

### Running All Services Together

This project is a monorepo with multiple services. To run all at once:

```
pnpm --filter @workspace/quickbook run dev
```

Or to run just the API server (if needed):

```
pnpm --filter @workspace/api-server run dev
```

---

### Troubleshooting on Windows

| Issue | Fix |
|-------|-----|
| `pnpm` not recognized | Re-open terminal after `npm install -g pnpm` |
| Port already in use | Change port in `vite.config.ts` or kill the process using `netstat -ano \| findstr :21933` |
| Node version too old | Download latest LTS from nodejs.org |
| `EACCES` permission error | Run terminal as Administrator |
| Long path errors | Enable long paths: run `git config --system core.longpaths true` |

---

### Project Structure

```
artifacts/
  quickbook/          Main React + Vite app
    src/
      features/       Feature modules (businesses, bookings, auth, etc.)
      components/     Shared UI components
      data/           Mock data & types
      store/          Zustand state stores
  api-server/         Express API server (optional backend)
lib/
  api-spec/           OpenAPI spec + generated types
```

---

### Tech Stack

- **React 18** + **TypeScript**
- **Vite** (dev server & bundler)
- **Tailwind CSS v4**
- **Lucide React** (icons)
- **Zustand** (state management)
- **pnpm workspaces** (monorepo)
