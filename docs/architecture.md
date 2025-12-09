# System Architecture

## 1. Backend Architecture
The backend is built as a **RESTful API** using **Node.js** and **Express**, designed to handle high-volume data requests efficiently. It follows the **Layered Architecture** pattern (Controller-Service-Data Access) to ensure separation of concerns and maintainability.

### Key Components:
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (Hosted on Aiven)
* **Optimization:**
    * **Indexing:** B-Tree indexes are used for standard columns (`region`, `gender`, `date`) and GIN (Trigram) indexes are used for fuzzy text search on `customer_name` and `phone_number`.
    * **Query Execution:** Uses `Promise.all` to execute data retrieval and pagination count queries in parallel, reducing response latency.
    * **Server-Side Pagination:** Implements `OFFSET` and `LIMIT` strategies to ensure constant memory usage regardless of dataset size.

### Layered Design:
`Request` -> **Router** (Route Definition) -> **Controller** (Req/Res Handling) -> **Service** (Business Logic/SQL Construction) -> **Database**

---

## 2. Frontend Architecture
The frontend is a **Single Page Application (SPA)** built with **React.js (Vite)**. It prioritizes a responsive, interactive user experience with immediate visual feedback.

### Key Components:
* **State Management:** Uses Custom Hooks (`useSalesData`) to centralize complex logic for pagination, filtering, sorting, and API fetching. This keeps UI components "dumb" and presentational.
* **Styling:** CSS Modules / Global CSS Variables for consistent theming and responsive Flexbox/Grid layouts.
* **Routing:** React Router DOM for view navigation.
* **HTTP Client:** Axios for robust API communication and error handling.

### Design Pattern:
* **Container/Presentational Pattern:**
    * **Pages (`Dashboard.jsx`):** Act as containers that hold state and pass data down.
    * **Components (`SalesTable.jsx`, `FilterPanel.jsx`):** Pure functional components that render data via props and emit events via callbacks.

---

## 3. Data Flow
The system relies on a **Server-Side Data Flow** model. The frontend does not process the full dataset; instead, it requests specific "views" of the data based on user input.

### Flow Scenario: User Applies a Filter
1.  **User Action:** User selects "Region: North" in the `FilterPanel`.
2.  **State Update:** The `useSalesData` hook updates the `filters` state and resets `page` to 1.
3.  **Effect Trigger:** The `useEffect` hook detects the state change and triggers `loadData()`.
4.  **API Request:** Frontend sends a GET request:
    `GET /api/sales?page=1&limit=10&region=North&sort=date`
5.  **Backend Processing:**
    * **Controller** extracts parameters.
    * **Service** constructs a dynamic SQL query using parameterized inputs (preventing SQL injection).
6.  **Database Execution:** PostgreSQL uses the `idx_sales_region` index to filter 1M rows instantly.
7.  **Response:** Backend returns JSON containing only the 10 relevant rows and total count metadata.
8.  **Render:** React updates the `data` state, causing `SalesTable` to re-render with the new rows.

---

## 4. Folder Structure
The project follows the strict monorepo structure required by the assignment.

```text
root/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection pool
│   │   ├── controllers/     # Request validation & response formatting
│   │   │   └── salesController.js
│   │   ├── services/        # Business logic & SQL query generation
│   │   │   └── salesService.js
│   │   ├── routes/          # API route definitions
│   │   │   └── salesRoutes.js
│   │   ├── utils/           
│   │   └── index.js         # Entry point (Express app setup)
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI (SalesTable, FilterPanel, etc.)
│   │   │   ├── SalesTable.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── StatsCards.jsx
│   │   ├── pages/           # Main Views
│   │   │   └── Dashboard.jsx
│   │   ├── hooks/           # Custom logic hooks
│   │   │   └── useSalesData.js
│   │   ├── services/        # API calls (Axios)
│   │   │   └── salesService.js
│   │   ├── styles/          # Global styles & specific overrides
│   │   │   └── global.css
│   │   ├── routes/          # Routing configuration
│   │   │   └── AppRoutes.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── .env
│
└── docs/
    └── architecture.md      # This document

```

## 5. Module Responsibilities

### Backend Modules
* **`index.js`**: Initializes the Express server, applies middleware (CORS, JSON parser), and mounts routes.
* **`controllers/salesController.js`**: Orchestrates the flow. It receives the request, calls the Service layer, handles errors via `catchAsync`, and sends the standard JSON response format.
* **`services/salesService.js`**: The "Brain" of the backend. It builds dynamic SQL `WHERE` clauses based on complex filter combinations (Ranges, Multi-selects, Tags) and executes queries against the DB pool.
* **`routes/salesRoutes.js`**: Maps HTTP endpoints (`/`, `/filters`, `/tags`) to specific controller functions.

### Frontend Modules
* **`pages/Dashboard.jsx`**: The main controller view. It integrates the Search, Filter, Stats, and Table components and passes down the state managed by the hook.
* **`hooks/useSalesData.js`**: Encapsulates all data-fetching logic. It manages debounce timers for search, synchronizes filter states, and handles loading/error states.
* **`components/FilterPanel.jsx`**: A complex UI component that renders dynamic multi-select dropdowns and range inputs based on metadata fetched from the backend.
* **`components/SalesTable.jsx`**: A presentation component responsible for rendering the data grid, handling column formatting (Dates, Currency), and empty states.
* **`services/salesService.js`**: The network layer. It standardizes API calls to the backend and handles environment variable configuration.