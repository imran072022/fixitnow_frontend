# FixItNow Frontend

FixItNow is a service marketplace frontend that connects customers with local technicians. Customers can discover services, request bookings, pay for accepted bookings, track appointments, and review completed work. Technicians can manage services, availability, and booking requests. Administrators can manage users, categories, and platform bookings.

The application is built with Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-style UI primitives, and a separate backend API.

> **Assignment reviewer note:** Please refer to the [project README](https://github.com/imran072022/fixItNow/blob/main/README.md) for the implemented business rules and application context. Reviewing this reference can help clarify the intended workflows and domain behavior.

## Features

- Public homepage with featured services and technicians
- Service and technician discovery with search, filters, sorting, and pagination
- Technician profiles with services, availability, ratings, and reviews
- Customer registration, login, profiles, bookings, payments, tracking, and create-only reviews
- Technician service and availability management
- Technician booking workflow from request to completion
- Administrator user status management, category CRUD, and booking oversight
- Cookie-based authentication with role-aware route protection
- Responsive layouts and loading skeletons for major routes

## Requirements

- Node.js 20 or newer
- pnpm 11 or compatible pnpm version
- A running FixItNow backend API

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://fixitnow-production-3f3b.up.railway.app/api
JWT_ACCESS_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
```

Start the development server:

```bash
pnpm dev
```

Open [https://fixitnow-frontend-pearl.vercel.app/](https://fixitnow-frontend-pearl.vercel.app/).

## Available Commands

| Command                  | Description                                       |
| ------------------------ | ------------------------------------------------- |
| `pnpm dev`               | Start the Next.js development server.             |
| `pnpm build`             | Create a production build.                        |
| `pnpm start`             | Run the production build.                         |
| `pnpm lint`              | Run ESLint across the project.                    |
| `pnpm exec tsc --noEmit` | Run TypeScript validation without emitting files. |

## Application Structure

```text
app/
  (auth)/                    Authentication routes and forms
  (public)/                  Public discovery and technician profile routes
  admin/manage/              Administrator management pages
  customer/                  Customer bookings, payments, and tracking
  technician/                Technician services, availability, and bookings
  profile/                   Authenticated profile page
  payment/                   Payment success and cancellation routes
components/
  shared/                    Navbar, footer, booking cards, and management shell
  skeleton/                  Loading skeletons
  ui/                        Reusable Base UI/shadcn-style primitives
lib/                         Authentication and shared utilities
proxy.ts                     Authentication refresh and role protection
```

## Route Overview

### Public

- `/` — Homepage
- `/services` — Service discovery
- `/technicians` — Technician discovery
- `/technicians/:id` — Technician profile
- `/login` — Login
- `/register` — Registration

### Customer

- `/customer/bookings` — Requested, active, and historical bookings
- `/customer/payments` — Payment history
- `/customer/track-booking` — Booking tracking

### Technician

- `/technician/manage` — Technician overview
- `/technician/manage/services` — Service management
- `/technician/manage/availability` — Availability management
- `/technician/manage/bookings` — Incoming, active, and historical bookings

### Administrator

- `/admin/manage` — Administrator overview
- `/admin/manage/users` — User status management
- `/admin/manage/categories` — Category CRUD
- `/admin/manage/bookings` — Platform booking management

## API Integration

The frontend uses the backend API configured by `NEXT_PUBLIC_API_URL`. Browser authentication and authenticated client-side API calls use the same-origin Next.js BFF:

- `POST /api/auth/login` forwards credentials to Railway and sets frontend-domain HttpOnly `accessToken` and `refreshToken` cookies.
- `POST /api/auth/logout` forwards the frontend cookies to Railway and clears both frontend cookies.
- `/api/backend/*` forwards authenticated browser requests and the frontend cookie header to the matching Railway endpoint.

Server-rendered authenticated helpers continue to call Railway directly with an explicit `Cookie` header created from Next.js `cookies()`. This keeps RootLayout authentication server-side without an unnecessary extra BFF request.

The full endpoint-to-component map is available in [API_INTEGRATION.md](API_INTEGRATION.md).

Most endpoints use this response format:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request completed successfully",
  "data": {}
}
```

## Authentication And Authorization

Authentication is cookie-based. The root layout loads the current user from Railway `/auth/me` during server rendering and explicitly forwards the frontend-domain cookies. Browser login and logout are handled by Next.js BFF routes. `proxy.ts` protects profile, customer, technician, and administrator routes by validating the frontend-domain access token and refreshing it through Railway when necessary.

The frontend owns the browser cookies. Railway remains responsible for JWT creation, authentication middleware, authorization, and user lookup. Railway `Set-Cookie` headers are not copied directly to the browser because they belong to the Railway domain.

Role restrictions are applied as follows:

- `CUSTOMER` can access `/customer/*`
- `TECHNICIAN` can access `/technician/*`
- `ADMIN` can access `/admin/*`

Unauthenticated users are redirected to `/login`, and authenticated users without the required role are redirected to `/403`.

## BFF Routes

```text
app/api/
  auth/
    login/route.ts       Browser login and frontend cookie creation
    logout/route.ts      Backend logout and frontend cookie clearing
  backend/
    [...path]/route.ts   Authenticated browser API forwarding
```

The generic backend route supports `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`. It forwards the request method, query string, `Content-Type`, request body where applicable, and frontend cookies. It deliberately does not forward host, content-length, connection-specific, or internal Next.js headers.

## Development Notes

- Public discovery pages use server-rendered data fetching and keep filters in URL query parameters.
- User-specific server data uses `cache: "no-store"` to avoid stale authenticated responses.
- Forms use React Hook Form with Zod validation where validation is required.
- API errors are surfaced through inline messages, page states, or toast notifications depending on the workflow.
- Reviews are currently create-only. Completed customers can submit a review, but the frontend does not expose review updates.

## Quality Checks

Before opening a pull request, run:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

Also verify the affected workflow against a running backend, especially authentication, role redirects, booking mutations, payments, and administrator actions.

## Related Documentation

- [API integration map](API_INTEGRATION.md)
- [Next.js documentation](https://nextjs.org/docs)
- [React documentation](https://react.dev/)
