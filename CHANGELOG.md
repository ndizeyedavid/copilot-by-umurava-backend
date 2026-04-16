# Changelog

All notable changes made during admin dashboard refactor + auth improvements.

## 16 / 04 / 2026

### Added

- Admin screening compare page at `frontend/app/admin/screening/[screeningId]/compare/page.tsx`.
  - Side-by-side candidate comparison.
  - Shared/unique skills + languages + other diff-oriented sections.
  - Resume view modal per candidate (iframe) when resume URL available.

- Admin screening results improvements in `frontend/app/components/admin/jobs/screening/ResultsStep.tsx`.
  - Summary vs detailed toggle.
  - Unified candidate selection for bulk email + compare.

- Admin profile page at `frontend/app/admin/profile/page.tsx`.
  - Fetch current user via `GET /auth/me`.
  - Update profile via `PUT /auth/profile` (firstName, lastName, picture).

- Auth password update endpoint.
  - `PUT /auth/password` (requires auth) implemented in `backend/src/controllers/auth.controller.ts`.
  - Route added in `backend/src/routers/auth.route.ts`.

- Google account linking for existing logged-in user.
  - `POST /auth/google/link/one-tap` (requires auth).
  - Links Google One Tap credential to current user; prevents linking if already used.

### Changed

- Admin dashboard job cards now fully API-driven.
  - `frontend/app/components/admin/dashboard/AdminDashboard.tsx` refactored to use shared `AdminJobsCards`.
  - Job actions wired (view/edit/open/close/delete) with React Query invalidation.

- Admin screening page now uses real API data.
  - `frontend/app/admin/screening/[screeningId]/page.tsx` fetches internal/external screening results.
  - External screening polling while processing.
  - Send email mutation wired to backend endpoint.

- Admin settings page integrated with backend auth + preferences.
  - `frontend/app/admin/settings/page.tsx` uses `GET /auth/me`.
  - Logout wired to `POST /auth/logout`.
  - Notification/account preferences persisted to `localStorage` per user.
  - Password change enabled via `PUT /auth/password`.
  - Google link UI added (One Tap) using `POST /auth/google/link/one-tap`.

- Auth routes now protected where needed.
  - `GET /auth/me`, `POST /auth/logout`, `PUT /auth/profile`, `POST /auth/refresh` now require auth middleware.
  - Fixes issue: `/auth/me` returned `Not authenticated` even after login.

- `GET /auth/me` response now exposes Google-link status without leaking `googleId`.
  - `backend/src/services/auth.service.ts` returns `hasGoogle: boolean` and strips `googleId`.

### Notes

- Frontend API client (`frontend/lib/api/client.ts`) sends `Authorization: Bearer <accessToken>` from `localStorage`.
- Local password update applies to local accounts only (accounts without password return error prompting Google login).
