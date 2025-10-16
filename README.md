# Loan Management Dashboard (React + Vite)

A modular loan management system showcasing user and admin experiences with local JSON data, React Context + reducers, Tailwind layouts, and Material UI components.

## Tech Stack

- React 18 with Vite bundler
- React Router for routing
- Context API + `useReducer` for auth and loan state
- Material UI 6 for tables, dialogs, icons, feedback
- Tailwind CSS for utility-first layout & theming helpers
- Date-fns utilities for date formatting

## Getting Started

```cmd
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` (opens automatically). Update `tailwind.config.js` or `vite.config.js` if port customization is required.

## Project Structure

```
src/
  components/        # Layout, cards, modals, theme & feedback atoms
  context/           # Context providers (auth, loans, theme)
  reducers/          # Pure reducers + action types
  pages/             # Route views for public, user, admin flows
  utils/             # Cross-cutting helpers (currency, dates, ids)
  data/              # Local JSON seeds for users & loans
  tailwind.css       # Tailwind layer imports + base tweaks
  main.jsx           # App bootstrap with providers & router
  App.jsx            # Global router + layout shell
```

## Available Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview production build locally
- `npm run lint` – lint using ESLint + Standard config

## Seed Accounts

| Role  | Email                        | Password     |
|-------|------------------------------|--------------|
| User  | `asha.patel@example.com`     | `password123`|
| User  | `vikram.sharma@example.com`  | `password123`|
| Admin | `nisha.rao@example.com`      | `admin123`   |

## Extending or Replacing Data

- JSON seeds live in `src/data/*.json`. Add or adjust records to simulate new scenarios.
- Loan and auth reducers centralize all state mutations. Replace the reducer dispatches with async service calls when a backend is available.
- Context providers expose clearly named actions (`applyLoan`, `approveLoan`, etc.) that can wrap API calls while keeping UI components unchanged.

## Theming & Accessibility

- Light/dark mode toggle persists to `localStorage` (`lms.theme-preference`).
- Modals & snackbars use controlled z-index layers (`Navbar` z-50, modals z-60+).
- Tables use semantic MUI components; form controls include helper text for validation feedback.

## Testing Ideas

- Add unit tests around reducers using your preferred test runner (Vitest + Testing Library integrate well with Vite).
- For integration tests, render pages with `MemoryRouter` and provide mocked contexts to verify flows without a backend.

## Production Notes

- Swap JSON seeds with REST/GraphQL calls inside context actions.
- Replace the optimistic transaction ID generator with the real value from your payment gateway.
- Harden authentication by plugging into your identity provider and removing local password checks.
