# Gym Management System

**Course:** CENG301 – Database Systems  
**Project:** Gym Management System Implementation

This project is a comprehensive web-based dashboard designed to manage the daily operations of a gym. It serves as the practical implementation for the keys concepts covered in the CENG301 course, including Entity-Relationship (ER) modeling, relational database mapping, and full-stack application development. The system facilitates the management of members, memberships, trainers, classes, enrollments, and payments, while also providing analytical reports and demonstrating database stored procedures.

## Technologies Used

*   **Frontend:** EJS (Embedded JavaScript Templating), HTML5, CSS3, Vanilla JavaScript.
*   **Server / Application Layer:** Node.js, Express.js.
*   **Database (Target):** PostgreSQL (Relational Database Management System).
*   **Development Architecture:** Front-end Logic with Mock Data (Integration-Ready for REST API).

## Features Overview

*   **Executive Dashboard:** Real-time overview of key performance indicators (KPIs) such as total members, active classes, monthly revenue, and a live feed of recent activities (payments and enrollments).
*   **Membership Management:** functionality to create and manage different membership tiers (Silver, Gold, Platinum) with defined prices and durations.
*   **Member Management:** Comprehensive CRUD (Create, Read, Update, Delete) operations for member profiles, including personal details, contact info, and membership assignment.
*   **Trainer & Class Scheduling:** Tools to manage trainer profiles and schedule fitness classes (e.g., Boxing, Yoga) with capacity limits.
*   **Enrollments:** System to enroll members in specific classes, enforcing constraints such as avoiding duplicate enrollments.
*   **Financial Management:** Recording and tracking of member payments with support for multiple payment methods.
*   **Analytics & Reports:** Dedicated reports page showcasing revenue analysis, class popularity, trainer workload, and member demographics.
*   **Stored Procedure Simulation:** A demonstration feature simulating the execution of a PostgreSQL stored function (`calculate_member_lifetime_value`) to compute financial insights.

## Database Schema (Summary)

The system is designed around the following core entities:

*   **MEMBERSHIP:** `membership_id`, `type`, `price`, `duration`
*   **MEMBER:** `member_id`, `first_name`, `last_name`, `gender`, `date_of_birth`, `phone`, `email`, `registration_date`, `membership_id`
*   **TRAINER:** `trainer_id`, `first_name`, `last_name`, `phone`, `email`, `specialization`
*   **CLASS:** `class_id`, `class_name`, `schedule`, `capacity`, `trainer_id`
*   **CLASS_ENROLLMENT:** `enrollment_id`, `member_id`, `class_id`, `enrollment_date`
*   **PAYMENT:** `payment_id`, `member_id`, `amount`, `payment_date`, `payment_method`

## Project Structure

*   **`server.js`**: The main application entry point. It handles all routing, mock data logic, and contains the integration toggle configuration.
*   **`views/`**: Contains all EJS templates.
    *   `pages/`: Individual page templates (Dashboard, Members, Reports, etc.).
    *   `partials/`: Reusable UI components (Headers, Footers, Navigation).
*   **`public/`**: Static assets.
    *   `css/`: Stylesheets (`style.css`).
    *   `js/`: Client-side scripts (`main.js` for modal interaction and dynamic forms).
    *   `images/`: Assets like login backgrounds.
*   **`USE_API Flag`**: A configuration constant in `server.js` that determines whether the application operates on internal mock data (default) or attempts to connect to a live backend API.

## How to Run the Project (Local)

1.  Ensure **Node.js** is installed on your machine.
2.  Open a terminal in the project root directory.
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the server:
    ```bash
    npm start
    ```
5.  Open your browser and navigate to:
    `http://localhost:3000/login`
    *(Default credentials are cosmetic; click "Sign In" to proceed)*

## Backend Integration Notes

This application is built to be **Integration-Ready**.

*   **USE_API Flag:** Located at the top of `server.js`.
    *   `false` (Default): The app runs fully functional using local memory arrays.
    *   `true`: The app's route handlers switch to executing placeholder logic for API calls.
*   **Integration Points:** All CRUD routes in `server.js` are wrapped in `if (USE_API)` blocks. An integrator simply needs to replace the `TODO` placeholders with actual `axios` or `fetch` calls to the PostgreSQL backend endpoints.
*   **API Contract:** The backend is expected to return JSON arrays matching the entity structures defined in the "Database Schema" section above.

## Team Roles

*   **ER Model Design:** Conceptualizing entities and relationships.
*   **Schema & Mapping:** Converting ER models to PostgreSQL schema and constraints.
*   **Backend SQL & SP:** Implementing DDL, DML, and Stored Procedures.
*   **Frontend/UI:** Developing the Dashboard, Views, and User Experience.
*   **Integration & Testing:** Connecting the UI to the Database and verifying system integrity.

## demo & Visuals

*   **Screenshots:** Complete UI screenshots demonstrating all features are included in the final project report.
*   **Focus:** This repository serves as the codebase deliverable, demonstrating the functional frontend implementation and readiness for database connectivity.

## Notes / Limitations

*   **Authentication:** The login screen is a UI demonstration; true authentication should be handled by the backend session management.
*   **Persistence:** In the current mode (`USE_API = false`), data is stored in memory and resets when the server restarts.
*   **Academic Scope:** This project is designed to demonstrate specific database systems learning outcomes.
