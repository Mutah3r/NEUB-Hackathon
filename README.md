
## 💉 Project - TikaSheba

> **TikaSheba** is an integrated, secure, and data-driven platform designed to **digitally transform and streamline the end-to-end national vaccination workflow**. It resolves critical issues like fragmented workflows, manual logging, and poor forecasting by offering role-based access to citizens, vaccination centers, staff, and health authorities. By leveraging a modern MERN stack architecture and integrating **advanced AI/ML automation** (including Meta Prophet and Gemini API), TikaSheba ensures real-time visibility, optimized stock management, and proactive demand forecasting to achieve maximum vaccination coverage and operational efficiency.

-----

## Problem Addressed 🛑

TikaSheba targets the following critical inefficiencies in traditional vaccination management:

  * **Fragmented Workflows:** Disjointed processes across citizens, centers, and authorities leading to missed appointments, poor coordination, and user frustration.
  * **Operational Inefficiencies:** Reliance on manual coordination and paper-based logs hindering real-time tracking of vaccine usage, staff activity, and stock levels.
  * **Mismatched Capacity and Demand:** Limited or non-existent forecasting capability causing critical mismatches between center capacity, available stock, and citizen appointment demand.

-----

## Team Members 👥

*You remain the same team, **\# TEAM ONTORPONTHIK***.

  - **Arfatul Islam Asif** [](mailto:awakicde@gmail.com)
  - **Unayes Ahmed Khan** [](mailto:unayeskhan.0808@gmail.com)
  - **Mutaher Ahmed Shakil** [](mailto:mutaher.shakil@gmail.com)

-----

## 💻 Technologies Used (MERN + AI)

### Frontend & Mobile

  -  **React (Web) + Vite**: To build the administrative and citizen web dashboards.
  -  **React Native (Mobile) / tikasheba/**: For citizen and staff-facing mobile application flows.
  - **Tailwind CSS**: For rapid, utility-first styling (inheriting from EcoSync).

### Backend & Core Services

  -  **Node.js + Express.js**: For building robust RESTful APIs with efficient services.
  - **Swagger**: For clear, documented API specifications.
  - **Twilio/Nodemailer**: For notifications, reminders, and OTP delivery via SMS/Email.

### Database

  -  **MongoDB + Mongoose**: For flexible schema design supporting time-series logging, center-scoped data, and complex relationships (e.g., `appointments`, `vaccine_log`).

### Authentication & Security

  -  **JSON Web Token (JWT)**: For secure, stateless authentication.
  - **Role-Based Access Control (RBAC)**: Custom middleware to enforce security policies and centre scoping per user type.

-----

## ✨ Key Features & Functionality

1.  **Role-Based Dashboards** 🚪: Custom interfaces optimized for **Citizen**, **Staff**, **Vaccine Centre Manager**, and **Authority** roles.
2.  **Full Appointment Lifecycle** 🗓️: Comprehensive APIs for request, schedule, cancellation, and status updates, including focused views for "Today" and "Next 14 Days" scheduling.
3.  **QR-Based Verification** ✅: Rapid, secure QR verification flow to "mark done" appointments at the center for quick status updates and history logging.
4.  **Vaccine Stock & Usage Logging** 📦: Center-level inventory management, tracking dose usage, wastage, and enabling staff efficiency reporting.
5.  **Secure Citizen Management** 👤: User registration, profile updates, and secure storage of complete vaccine history.
6.  **Real-Time Reporting** 📊: Operational dashboards providing crucial KPIs on scheduled volumes, usage summaries, and center performance.

-----

## 🤖 AI and ML Automation Engine

A dedicated Python module (`AI_and_ML/`) leverages data-driven models for automation and insight.

| Feature | ML Tool | Benefit |
| :--- | :--- | :--- |
| **Demand Forecasting** | **Meta Prophet Model** | Predicts appointment volumes by center/date, informing capacity planning and stock requests. |
| **Capacity Optimization** | **ML Recommendations** | Recommends optimal adjustments to stock and daily appointment limits based on forecasted demand. |
| **No-Show Prediction** | **Classification Model** | Identifies high-risk appointments to trigger proactive reminders (via SMS/Email) and resource reallocation. |
| **Anomaly Detection** | **ML Model** | Flags unusual patterns in dose usage or wastage logs to improve accountability and prevent stock pilferage. |
| **Citizen Segmentation** | **Clustering/Embedding (Gemini API)** | Groups citizens by behavior/history to tailor outreach campaigns for improved uptake and compliance. |
| **Prompt/Response Engine** | **Gemini API (LLM)** | Utilized for advanced search, help documentation generation, or summarizing complex reports. |

-----

## 🚀 Future Improvements & Roadmap

The TikaSheba roadmap focuses on real-time capabilities, deeper integrations, and system maturity:

1.  **Real-time Operations** 📡: Implement WebSocket updates for live dashboards, queue lengths, and immediate stock level changes.
2.  **Deeper Integrations** 🔗: Connect with national health registries, advanced SMS gateways, and Health Information Exchanges (HIEs).
3.  **Advanced Analytics** 🔬: Introduce cohort analysis, longitudinal reporting, and vaccine efficacy monitoring signals.
4.  **DevOps Maturity** 🐳: Establish CI/CD pipelines, Infrastructure-as-Code (IaC), and robust monitoring/alerting systems.
5.  **Enhanced UX/Accessibility** 🌐: Implement full multilingual UX localization and align design with WCAG accessibility standards.

-----