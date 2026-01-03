# Address Book - Client

The frontend application for the Address Book (Personal CRM). Built with React, TypeScript, and Material UI v6, offering a modern, responsive, and theme-aware interface for managing personal contacts.

## 🚀 Features implemented

### Core Functionality
- **Authentication:** Secure Login and Registration pages with JWT storage.
- **Dashboard:** Responsive grid layout displaying contact cards.
- **CRUD Operations:** Full capability to Create, Read, Update, and Delete contacts.
- **Custom Fields:** Dynamic key-value pair system allowing users to add arbitrary data (e.g., Birthday, LinkedIn) to any contact.
- **Tagging System:**
    - Create/Delete tags.
    - Assign colors to tags.
    - Filter dashboard by specific tags.
    - Visual "Chips" on contact cards.
- **Search & Filter:** Real-time client-side search (by name/email) and tag filtering.

### UX & UI Polish
- **Dark/Light Mode:** Global theme toggle using React Context and MUI ThemeProvider.
- **Responsive Design:** Adapts to mobile and desktop screens using MUI Grid v6.
- **Interactive Modals:** All forms (Add, Edit, Manage Tags) open in clean Dialog components.
- **Data Safety:** Confirmation dialogs before deleting data.

## 🛠 Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **UI Library:** Material UI (MUI) v6
- **Icons:** MUI Icons Material
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios (configured with interceptors for Auth headers)

## 📂 Project Structure

```text
src/
├── api/
│   └── axios.ts           # Centralized Axios instance with JWT interceptor
├── components/
│   ├── ContactForm.tsx    # Complex form for Creating AND Editing contacts
│   ├── ContactDetails.tsx # Read-only modal displaying full profile + custom fields
│   ├── Navbar.tsx         # Navigation, Logout, and Theme Toggle logic
│   └── TagManager.tsx     # Modal for creating/deleting tags
├── pages/
│   ├── Dashboard.tsx      # Main application view (Grid + Search Toolbar)
│   ├── Login.tsx          # Auth page
│   └── Register.tsx       # Auth page
├── App.tsx                # Route definitions & Theme Provider setup
├── ColorModeContext.ts    # Independent Context for Light/Dark mode state
└── main.tsx               # Entry point