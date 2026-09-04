# API Integration Map

This document maps the FixItNow frontend features to the backend API endpoints they consume.

## Configuration

The frontend builds API URLs from:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Authenticated requests use the browser cookies through `credentials: "include"` on client requests or forward the request cookie from `next/headers` on server requests.

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

| Frontend feature                 | Method | Endpoint              | Purpose                                                   |
| -------------------------------- | ------ | --------------------- | --------------------------------------------------------- |
| Login page                       | `POST` | `/auth/login`         | Authenticate a user and establish access/refresh cookies. |
| Registration page                | `POST` | `/auth/register`      | Create a customer, technician, or administrator account.  |
| Root layout / navbar             | `GET`  | `/auth/me`            | Load the currently authenticated user.                    |
| Technician profile booking guard | `GET`  | `/auth/me`            | Confirm authentication before opening the booking form.   |
| Logout action                    | `POST` | `/auth/logout`        | End the current session.                                  |
| Proxy token refresh              | `POST` | `/auth/refresh-token` | Refresh an expired access token using the refresh cookie. |

## Public Discovery

| Frontend feature              | Method | Endpoint           | Purpose                                                                                              |
| ----------------------------- | ------ | ------------------ | ---------------------------------------------------------------------------------------------------- |
| Services page and homepage    | `GET`  | `/services`        | Fetch services with optional search, category, price, sort, page, and limit filters.                 |
| Technicians page and homepage | `GET`  | `/technicians`     | Fetch technicians with optional search, category, experience, rating, sort, page, and limit filters. |
| Technician profile page       | `GET`  | `/technicians/:id` | Fetch a technician profile, services, availability, and review data.                                 |
| Service/technician filters    | `GET`  | `/categories`      | Load category names used by public filters and technician service forms.                             |

The homepage requests both discovery endpoints with `page=1` and `limit=4`.

## Bookings

| Frontend feature                    | Method  | Endpoint                            | Purpose                                                                                                  |
| ----------------------------------- | ------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Booking list pages                  | `GET`   | `/bookings`                         | Load customer, technician, or administrator booking lists.                                               |
| Booking tracking                    | `GET`   | `/bookings/:id`                     | Load one booking for the tracking page.                                                                  |
| Booking request modal               | `POST`  | `/bookings`                         | Create a booking request.                                                                                |
| Technician/customer booking actions | `PATCH` | `/bookings/:id/status`              | Change a booking between requested, accepted, paid, in-progress, completed, denied, or cancelled states. |
| Customer checkout action            | `POST`  | `/payments/create-checkout-session` | Create a payment checkout session for a booking.                                                         |
| Customer review dialog              | `POST`  | `/reviews`                          | Create a review for a completed booking. Reviews are create-only in the frontend.                        |

Booking list responses include a nullable `review` object when the backend provides one. The frontend only exposes the review action to customers for completed bookings.

## Payments

| Frontend feature         | Method           | Endpoint                      | Purpose                                                                                      |
| ------------------------ | ---------------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| Customer payment history | `GET`            | `/payments`                   | Load all payment transactions for the authenticated customer, including failed transactions. |
| Payment success page     | Browser redirect | Backend-provided checkout URL | Return to the payment success route after checkout.                                          |
| Payment cancel page      | Browser redirect | Backend-provided checkout URL | Return to the payment cancel route when checkout is abandoned.                               |

## Profile

| Frontend feature | Method  | Endpoint      | Purpose                                                                    |
| ---------------- | ------- | ------------- | -------------------------------------------------------------------------- |
| Profile page     | `GET`   | `/profile/me` | Load the authenticated user's profile.                                     |
| Profile form     | `PATCH` | `/profile/me` | Update name, photo, phone, and technician profile fields where applicable. |

## Technician Management

| Frontend feature         | Method  | Endpoint                           | Purpose                                   |
| ------------------------ | ------- | ---------------------------------- | ----------------------------------------- |
| Availability page        | `GET`   | `/technicians/me/availability`     | Load the technician's availability slots. |
| Availability modal       | `POST`  | `/technicians/me/availability`     | Create an availability slot.              |
| Availability modal       | `PATCH` | `/technicians/me/availability/:id` | Update an availability slot.              |
| Technician services page | `GET`   | `/categories`                      | Load categories for the service form.     |
| Technician services page | `POST`  | `/services`                        | Create a technician service.              |

## Administrator Management

| Frontend feature      | Method   | Endpoint           | Purpose                                                                                 |
| --------------------- | -------- | ------------------ | --------------------------------------------------------------------------------------- |
| Admin users page      | `GET`    | `/admin/users`     | Load users for the administrator list.                                                  |
| Admin users page      | `PATCH`  | `/admin/users/:id` | Toggle a user's status by sending `{ "status": "ACTIVE" }` or `{ "status": "BANNED" }`. |
| Admin categories page | `GET`    | `/categories`      | Load the category list.                                                                 |
| Admin categories page | `POST`   | `/categories`      | Create a category with the current frontend payload `{ "categoryName": "..." }`.        |
| Admin categories page | `PATCH`  | `/categories/:id`  | Update a category with `{ "name": "..." }`.                                             |
| Admin categories page | `DELETE` | `/categories/:id`  | Delete a category by ID.                                                                |

## Error Handling

- Server-rendered data helpers use `cache: "no-store"` for authenticated, user-specific data.
- Client mutations check both HTTP status and the response `success` flag.
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
- `lib/auth.client.ts`
- `lib/auth.ts`
- `proxy.ts`
