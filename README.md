# Retail Sales Management System

## 1. Overview
This is a full-stack Retail Sales Management System designed to efficiently handle and display over 1 million sales records. It features a responsive React frontend with advanced server-side operations to ensure high performance. The system supports complex multi-select filtering, full-text search, and smart pagination, matching the strict engineering and UI requirements of the TruEstate assignment.

## 2. Tech Stack
* **Frontend:** React.js (Vite), Pure CSS (Flexbox/Grid), Axios
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (hosted on Aiven)
* **Tools:** Git, Postman

## 3. Search Implementation Summary
Search is implemented using a **case-insensitive** full-text approach on the backend.
* **Backend:** Uses the SQL `ILIKE` operator within a dynamic `WHERE` clause to match query strings against both `customer_name` and `phone_number` columns simultaneously (`OR` condition).
* **Frontend:** A custom search hook implements **debouncing (500ms)** to prevent excessive API calls while typing. Search state resets the current page to 1 automatically to ensure valid results.

## 4. Filter Implementation Summary
Filters support **Multi-Select** (Region, Gender, Category, Payment, Tags) and **Range-based** logic (Age, Date).
* **Backend:** The controller dynamically constructs the SQL query. Multi-select values are parsed into `IN (...)` clauses, while ranges use `>=` and `<=` operators. Tags are handled via an array intersection or fuzzy `ILIKE` logic.
* **Frontend:** A custom `MultiSelectPill` component allows users to toggle multiple values. Active filters are serialized into query parameters. Filter metadata (available regions, categories, etc.) is fetched dynamically from the database on initialization.

## 5. Sorting Implementation Summary
Sorting is handled server-side to ensure accuracy across the entire 1-million-row dataset.
* **Backend:** Accepts `sortBy` and `sortOrder` parameters. An allow-list (whitelist) prevents SQL injection by validating fields (e.g., `date`, `quantity`, `customer_name`) before applying them to the `ORDER BY` clause.
* **Frontend:** A dropdown control updates the sort state in the main hook, triggering a data refresh while preserving all active search and filter criteria.

## 6. Pagination Implementation Summary
Pagination is strictly **Server-Side** to maintain low memory usage and fast response times.
* **Backend:** Uses SQL `LIMIT` (10 items) and `OFFSET` based on the requested page number. It executes a parallel `COUNT(*)` query to determine total pages accurately even when filters are active.
* **Frontend:** Displays a smart window of page numbers (e.g., `1 ... 4 5 6 ... 100`) to handle large page counts gracefully without overcrowding the UI.

## 7. Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone <repository_url>
    cd <project_folder>
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file with: DATABASE_URL=postgres://<user>:<password>@<host>:<port>/defaultdb?sslmode=require
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    # Create .env file with: VITE_API_URL=http://localhost:5000/api/sales
    npm run dev
    ```

4.  **Access Application**
    Open `http://localhost:5173` in your browser.
