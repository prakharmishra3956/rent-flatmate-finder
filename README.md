# Rent & Flatmate Finder

Rent & Flatmate Finder is a modern, high-quality property listing and roommate matching platform. It pairs prospective tenants with property listings based on location, budget, room type, and amenity preferences, calculating real-time compatibility scores using the Google Gemini AI model. It features real-time messaging, interest applications, and an administrator panel.

---

## 🚀 Key Features

* **AI Roommate Compatibility Matcher**: Compares tenant preferences with room listings to output compatibility scores (0–100%) and conversational explanations powered by Gemini 1.5 Flash. Includes a rule-based local backup calculation.
* **Real-time Messaging**: Socket.IO-based chat system permitting tenants and owners to communicate in real-time, bound by private room namespaces.
* **Interest Request System**: Tenants can express interest in listings. Request statuses (`Accepted`/`Rejected`) update instantly and notify participants.
* **Email Notification Flow**: Sends automated Nodemailer alerts for high compatibility candidates (>80% score) and status changes.
* **Admin Control Center**: Visual portal to audit platform stats, delete violating users, close listings, and manage resources.
* **Responsive Design System**: Glassmorphism, tailored dark modes, smooth hover micro-animations, built using Next.js and Tailwind CSS.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 16 (App Router), Tailwind CSS, React Query, Axios, Lucide icons, Socket.io-client.
* **Backend**: Node.js, Express.js, Socket.IO, Nodemailer, Mongoose.
* **Database**: MongoDB (Local or Atlas).
* **AI Model**: Google Gemini API (`gemini-1.5-flash`).
* **Images**: Cloudinary.

---

## 📂 Project Structure

```text
rent-flatmate-finder/
├── client/                 # Next.js Frontend
│   ├── app/                # App Router Pages (register, login, tenant, owner, admin)
│   ├── components/         # Reusable Components (Chat, Sidebar, Forms)
│   ├── services/           # Axios APIs (auth, tenant, listings, admin)
│   └── package.json
└── server/                 # Express.js Backend
    ├── config/             # DB and Environment setups
    ├── controllers/        # Route Handlers (auth, admin, interest, chat, listings)
    ├── middleware/         # Auth, Roles, and Validators
    ├── models/             # Mongoose Schemas (User, Listing, Interest, Compatibility, Message)
    ├── routes/             # Express Router Definitions
    ├── services/           # Business Logic (email, socket, upload, ai/gemini)
    └── tests/              # Jest Integration Test Suites
```

---

## 🔧 Installation & Setup

### 1. Prerequisites
* Node.js v18+
* MongoDB running locally or a MongoDB Atlas connection string.

### 2. Backend Config
Navigate to the `server/` directory, create a `.env` file, and populate:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/rent-flatmate-finder
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Install packages and run the server:
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Config
Navigate to the `client/` directory:
```bash
cd ../client
npm install
npm run dev
```
Open `http://localhost:3000` to interact with the platform.

---

## 🧪 Testing

To run the automated integration tests:
```bash
cd server
npm test
```
All 6 test suites (`auth`, `listing`, `chat`, `compatibility`, `interest`, `dashboard`) comprising 25 test specs should pass successfully.

---

## 📝 Documentations

* Detailed Endpoints Table: [API_DOCUMENTATION.md](file:///d:/project/rent-flatmate-finder/API_DOCUMENTATION.md)
* System Architecture & Design (800+ Words): [SYSTEM_DESIGN.md](file:///d:/project/rent-flatmate-finder/SYSTEM_DESIGN.md)
