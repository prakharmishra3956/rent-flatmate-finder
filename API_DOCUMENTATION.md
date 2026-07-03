# API Endpoints Documentation

This document describes all the API endpoints provided by the Rent & Flatmate Finder backend server. All routes are prefixed with `/api`.

---

## 🔐 Authentication Endpoints

| Method | Endpoint | Description | Headers / Auth | Request Body | Response JSON |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Register a new tenant, owner, or admin. | None | `{ name, email, password, role }` | `{ success: true, message: "User Registered" }` |
| **POST** | `/auth/login` | Log in and receive a JWT authorization token. | None | `{ email, password }` | `{ token, user: { _id, name, email, role } }` |

---

## 🏠 Listing Endpoints

| Method | Endpoint | Description | Headers / Auth | Request Params / Query | Response JSON |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/listings` | Search and filter available rooms. | None | Query: `location`, `minRent`, `maxRent`, `roomType`, `furnishing` | `{ success: true, listings: [...] }` |
| **GET** | `/listings/:id` | Retrieve a single listing detail. | None | Params: `id` | `{ success: true, listing: {...} }` |
| **POST** | `/listings` | Create a new listing. | Bearer JWT (Owner) | Body: `{ title, description, location, address, rent, securityDeposit, availableFrom, roomType, furnishing, amenities }` | `{ success: true, listing: {...} }` |
| **PUT** | `/listings/:id` | Update an owned listing. | Bearer JWT (Owner) | Params: `id`, Body: update fields | `{ success: true, listing: {...} }` |
| **DELETE** | `/listings/:id` | Remove a listing. | Bearer JWT (Owner) | Params: `id` | `{ success: true, message: "Listing deleted" }` |
| **PATCH** | `/listings/:id/fill` | Toggle listing status to "Filled". | Bearer JWT (Owner) | Params: `id` | `{ success: true, listing: {...} }` |

---

## 👤 Tenant Profile Endpoints

| Method | Endpoint | Description | Headers / Auth | Request Body | Response JSON |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/tenant/profile` | Create tenant search profile. | Bearer JWT (Tenant) | `{ preferredLocation, budgetMin, budgetMax, preferredRoomType, preferredAmenities }` | `{ success: true, profile: {...} }` |
| **GET** | `/tenant/profile` | Retrieve tenant search profile. | Bearer JWT (Tenant) | None | `{ success: true, profile: {...} }` |
| **PUT** | `/tenant/profile` | Update tenant search profile. | Bearer JWT (Tenant) | `{ preferredLocation, budgetMin, budgetMax, preferredRoomType, preferredAmenities }` | `{ success: true, profile: {...} }` |
| **GET** | `/tenant/compatibility/:listingId` | Compute AI Compatibility score for listing. | Bearer JWT (Tenant) | Params: `listingId` | `{ success: true, compatibility: { score, explanation } }` |

---

## 🤝 Interest Request Endpoints

| Method | Endpoint | Description | Headers / Auth | Request Body / Params | Response JSON |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/interests` | Send an interest application to owner. | Bearer JWT (Tenant) | `{ listingId, message }` | `{ success: true, interest: {...} }` |
| **GET** | `/interests/tenant` | View applications sent by tenant. | Bearer JWT (Tenant) | None | `{ success: true, interests: [...] }` |
| **GET** | `/interests/owner` | View applications received by owner. | Bearer JWT (Owner) | None | `{ success: true, interests: [...] }` |
| **PUT** | `/interests/:id/status` | Accept or reject interest request. | Bearer JWT (Owner) | Params: `id`, Body: `{ status: "Accepted" \| "Rejected" }` | `{ success: true, interest: {...} }` |

---

## 💬 Chat Endpoints

| Method | Endpoint | Description | Headers / Auth | Request Params | Response JSON |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/chats/:listingId/:tenantId` | Fetch chat history logs. | Bearer JWT (Tenant/Owner) | Params: `listingId`, `tenantId` | `{ success: true, messages: [...] }` |

---

## 🛡️ Admin Endpoints

| Method | Endpoint | Description | Headers / Auth | Request Params / Body | Response JSON |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/admin/dashboard` | Get platform aggregate stats. | Bearer JWT (Admin) | None | `{ success: true, stats: { totalUsers, totalListings, filledListings, pendingInterests } }` |
| **GET** | `/admin/users` | List all system users. | Bearer JWT (Admin) | None | `{ success: true, users: [...] }` |
| **DELETE** | `/admin/users/:id` | Wipe out a violating user account. | Bearer JWT (Admin) | Params: `id` | `{ success: true, message: "User deleted" }` |
| **GET** | `/admin/listings` | List all platform room listings. | Bearer JWT (Admin) | None | `{ success: true, listings: [...] }` |
| **DELETE** | `/admin/listings/:id` | Remove a listing from platform. | Bearer JWT (Admin) | Params: `id` | `{ success: true, message: "Listing deleted" }` |
| **PATCH** | `/admin/listings/:id/fill` | Toggle listing status. | Bearer JWT (Admin) | Params: `id` | `{ success: true, listing: {...} }` |
