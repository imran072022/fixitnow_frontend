# API Integration Map

This document maps the FixItNow frontend features to the backend API endpoints they consume.

> **Reviewer note:** Assignment reviewers are encouraged to consult the [project README](https://github.com/imran072022/fixItNow/blob/main/README.md) for the implemented business rules and application context. This reference may help clarify workflows and domain behavior during review.

## Configuration

The frontend builds API URLs from:

```env
NEXT_PUBLIC_API_URL=https://fixitnow-production-3f3b.up.railway.app/api
```

The browser uses same-origin Next.js BFF routes for authentication and authenticated API calls. Those routes read the frontend-domain HttpOnly cookies and explicitly forward them to Railway. Server-rendered authenticated helpers continue to call Railway directly while forwarding the request cookie from `next/headers`.

Most successful responses follow this shape:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": {}
}
```

## Authentication

| Frontend feature                 | Browser/Next.js endpoint   | Backend endpoint           | Purpose                                                    |
| -------------------------------- | -------------------------- | -------------------------- | ---------------------------------------------------------- |
| Login page                       | `POST /api/auth/login`     | `POST /auth/login`         | Authenticate a user and establish frontend-domain cookies. |
| Registration page                | `POST /auth/register`      | `POST /auth/register`      | Create a customer, technician, or administrator account.   |
| Root layout / navbar             | Server-side                | `GET /auth/me`             | Load the current user with explicitly forwarded cookies.   |
| Technician profile booking guard | `GET /api/backend/auth/me` | `GET /auth/me`             | Confirm authentication before opening the booking form.    |
| Logout action                    | `POST /api/auth/logout`    | `POST /auth/logout`        | End the backend session and clear frontend cookies.        |
| Proxy token refresh              | Next.js proxy              | `POST /auth/refresh-token` | Refresh and verify an expired or missing access token.     |

### BFF and Cookie Flow

The browser-facing authentication boundary is the Next.js application. Successful login sets `accessToken` and `refreshToken` as HttpOnly cookies on the frontend domain with `path: "/"`, `sameSite: "lax"`, and `secure: true` in production. Railway `Set-Cookie` headers are not copied to the browser because those cookies belong to the Railway domain.

Authenticated browser API requests use `/api/backend/*`. The catch-all handler forwards the request method, query string, `Content-Type`, request body where applicable, and the frontend cookie header to the corresponding Railway endpoint. Express remains responsible for authentication, authorization, and business logic.

Server-side helpers such as `getCurrentUser()` continue to call Railway directly and send `Cookie: (await cookies()).toString()`. This avoids an unnecessary BFF hop during Server Component rendering.

The proxy protects `/profile/*`, `/admin/*`, `/technician/*`, and `/customer/*`. It verifies the frontend-domain access token, refreshes through Railway when the access token is missing or invalid, verifies the refreshed token, checks the required role, and writes refreshed tokens back as frontend-domain cookies.

## Public Discovery

| Frontend feature              | Method | Endpoint           | Purpose                                                                                              |
| ----------------------------- | ------ | ------------------ | ---------------------------------------------------------------------------------------------------- |
| Services page and homepage    | `GET`  | `/services`        | Fetch services with optional search, category, price, sort, page, and limit filters.                 |
| Technicians page and homepage | `GET`  | `/technicians`     | Fetch technicians with optional search, category, experience, rating, sort, page, and limit filters. |
| Technician profile page       | `GET`  | `/technicians/:id` | Fetch a technician profile, services, availability, and review data.                                 |
| Service/technician filters    | `GET`  | `/categories`      | Load category names used by public filters and technician service forms.                             |

The homepage requests both discovery endpoints with `page=1` and `limit=4`.

## Bookings

| Frontend feature                    | Method  | Endpoint                                        | Purpose                                                                                                  |
| ----------------------------------- | ------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Booking list pages                  | `GET`   | `/api/backend/bookings`                         | Load customer, technician, or administrator booking lists.                                               |
| Booking tracking                    | `GET`   | `/api/backend/bookings/:id`                     | Load one booking for the tracking page.                                                                  |
| Booking request modal               | `POST`  | `/api/backend/bookings`                         | Create a booking request.                                                                                |
| Technician/customer booking actions | `PATCH` | `/api/backend/bookings/:id/status`              | Change a booking between requested, accepted, paid, in-progress, completed, denied, or cancelled states. |
| Customer checkout action            | `POST`  | `/api/backend/payments/create-checkout-session` | Create a payment checkout session for a booking.                                                         |
| Customer review dialog              | `POST`  | `/api/backend/reviews`                          | Create a review for a completed booking. Reviews are create-only in the frontend.                        |

Booking list responses include a nullable `review` object when the backend provides one. The frontend only exposes the review action to customers for completed bookings.

## Payments

| Frontend feature         | Method           | Endpoint                      | Purpose                                                                                      |
| ------------------------ | ---------------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| Customer payment history | `GET`            | `/payments`                   | Load all payment transactions for the authenticated customer, including failed transactions. |
| Payment success page     | Browser redirect | Backend-provided checkout URL | Return to the payment success route after checkout.                                          |
| Payment cancel page      | Browser redirect | Backend-provided checkout URL | Return to the payment cancel route when checkout is abandoned.                               |

## Profile

| Frontend feature | Method  | Endpoint                    | Purpose                                                                    |
| ---------------- | ------- | --------------------------- | -------------------------------------------------------------------------- |
| Profile page     | `GET`   | Server-side → `/profile/me` | Load the authenticated user's profile with forwarded cookies.              |
| Profile form     | `PATCH` | `/api/backend/profile/me`   | Update name, photo, phone, and technician profile fields where applicable. |

## Technician Management

| Frontend feature         | Method  | Endpoint                                       | Purpose                                      |
| ------------------------ | ------- | ---------------------------------------------- | -------------------------------------------- |
| Availability page        | `GET`   | Server-side → `/technicians/me/availability`   | Load the technician's availability slots.    |
| Availability modal       | `POST`  | `/api/backend/technicians/me/availability`     | Create an availability slot.                 |
| Availability modal       | `PATCH` | `/api/backend/technicians/me/availability/:id` | Update an availability slot.                 |
| Technician services page | `GET`   | `/categories`                                  | Load public categories for the service form. |
| Technician services page | `POST`  | `/api/backend/services`                        | Create a technician service.                 |

## Administrator Management

| Frontend feature      | Method   | Endpoint                       | Purpose                                                                                 |
| --------------------- | -------- | ------------------------------ | --------------------------------------------------------------------------------------- |
| Admin users page      | `GET`    | Server-side → `/admin/users`   | Load users for the administrator list.                                                  |
| Admin users page      | `PATCH`  | `/api/backend/admin/users/:id` | Toggle a user's status by sending `{ "status": "ACTIVE" }` or `{ "status": "BANNED" }`. |
| Admin categories page | `GET`    | `/api/backend/categories`      | Load the category list.                                                                 |
| Admin categories page | `POST`   | `/api/backend/categories`      | Create a category with the current frontend payload `{ "categoryName": "..." }`.        |
| Admin categories page | `PATCH`  | `/api/backend/categories/:id`  | Update a category with `{ "name": "..." }`.                                             |
| Admin categories page | `DELETE` | `/api/backend/categories/:id`  | Delete a category by ID.                                                                |

## Error Handling

- Server-rendered data helpers use `cache: "no-store"` for authenticated, user-specific data.
- Client mutations check both HTTP status and the response `success` flag after passing through the BFF.
- API messages are surfaced through page error states, inline form errors, or toast notifications depending on the feature.
- Authentication failures are handled by the proxy, which redirects unauthenticated users to `/login` and unauthorized roles to `/403`.

## Frontend Data Modules

- `app/(public)/_data/services.ts`
- `app/(public)/_data/technicians.ts`
- `app/(public)/_data/categories.ts`
- `app/(public)/_data/bookings.client.ts`
- `app/(public)/_data/bookings.server.ts`
- `app/customer/payments/_data/payments.server.ts`
- `app/profile/_data/profile.client.ts`
- `app/profile/_data/profile.server.ts`
- `app/technician/_data/availability.client.ts`
- `app/technician/_data/availability.server.ts`
- `app/technician/_data/services.ts`
- `app/admin/manage/users/_data/users.client.ts`
- `app/admin/manage/users/_data/users.server.ts`
- `app/admin/manage/categories/_data/categories.client.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/backend/[...path]/route.ts`
- `lib/auth.client.ts`
- `lib/auth.ts`
- `proxy.ts`
