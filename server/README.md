# Address Book - Server API

The backend RESTful API for the Address Book application. Built with Node.js, Express, and TypeScript, backed by MongoDB.

## 🚀 Features Implemented

### Authentication & Security
- **JWT Authentication:** Issues JSON Web Tokens upon Login/Register.
- **Password Hashing:** Uses `bcryptjs` to salt and hash passwords before storage.
- **Middleware:** `authMiddleware` protects private routes, ensuring users can only manage their own data.
- **CORS:** Configured to allow requests from the client application.

### Data Management
- **Contact API:**
    - Full CRUD endpoints.
    - **Custom Fields:** Implemented using Mongoose `Map` (`of: String`) to store dynamic key-value pairs.
    - **Population:** Automatically populates Tag details (Name/Color) when fetching contacts.
- **Tag API:**
    - Supports creating, deleting, and hierarchical structure (Parent tags).
    - Prevents "Ghost Deletions" by using instance-level deletion methods.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose ODM)
- **Auth:** jsonwebtoken (JWT), bcryptjs
- **Utilities:** dotenv, cors, nodemon

## 📂 Project Structure

```text
src/
├── config/
│   └── db.ts               # Database connection logic
├── controllers/
│   ├── authController.ts   # Logic for Login/Register
│   ├── contactController.ts# Logic for CRUD operations on Contacts
│   └── tagController.ts    # Logic for Tag management
├── middleware/
│   └── authMiddleware.ts   # JWT verification middleware
├── models/
│   ├── Contact.ts          # Schema definition (includes Custom Fields Map)
│   ├── Tag.ts              # Schema definition
│   └── User.ts             # Schema definition
├── routes/
│   ├── authRoutes.ts
│   ├── contactRoutes.ts
│   └── tagRoutes.ts
└── server.ts               # Entry point and App configuration