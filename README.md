# TenantDesk – Multi-Tenant AI Support Ticket Platform

TenantDesk is a modern **multi-tenant SaaS helpdesk platform** built for businesses to manage customer support operations with AI-powered ticket analysis, team collaboration, and tenant-isolated workspaces.

---

##  Features

### Authentication & Roles

* JWT Authentication
* Role-Based Access Control
* Roles:

  * Super Admin
  * Tenant Admin
  * Agent
  * Customer

---

### Tenant Management

* Multi-Tenant Workspace Architecture
* Tenant-Isolated Data Access
* Tenant Domain Support
* Tenant Profile & Settings

---

### Ticket Management

* Create / Update / Resolve Tickets
* Priority Levels
* Ticket Categories
* Ticket Status Workflow
* Department Assignment
* Agent Assignment

---

### AI Ticket Intelligence

* Sentiment Analysis
* Priority Detection
* Auto Categorization
* Department Recommendation
* Suggested Reply Generation
* Escalation Detection

---

### Team Workspace

* Invite Agents
* Role-Protected Team Management
* Agent Directory
* Team Analytics

---

### Customer Directory

* Tenant-Specific Customer Listing
* Ticket Statistics per Customer
* Search / Filter Support

---

### Analytics Dashboard

* Total Tickets
* Open Tickets
* Resolved Tickets
* Resolution Metrics
* Status Breakdown

---

### UI / UX

* Premium Dark Theme Dashboard
* Responsive Layout
* Modern SaaS Design
* Theme Toggle Support

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* Lucide / React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

---

## 📁 Project Structure

```bash
Frontend/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── features/
│   ├── lib/
│   └── pages/

Backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
```

---

## 🔐 Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/tenantdesk.git
cd tenantdesk
```

---

### Backend Setup

```bash
cd Backend
npm install
npm run dev
```

---

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

## 👥 Demo Roles

### Tenant Admin

* Manage Team
* Invite Agents
* View Analytics
* Manage Customers
* Configure Workspace

### Agent

* Manage Tickets
* Respond to Customers
* View Assigned Tickets

### Customer

* Submit Support Tickets
* Track Ticket Status

---

## 🔒 Security Features

* Protected Routes
* Tenant-Level Data Isolation
* Role-Based Middleware Guards
* Password Hashing
* JWT Token Verification

---

## 📌 Future Enhancements

* Real-Time Chat Support
* Email Integration
* WhatsApp Ticket Channel
* Advanced Analytics Graphs
* SLA Management
* Notification Center
* File Attachments
* Audit Logs

---

## Developed By

* **Wais Shaikh** – Full Stack Developer
  GitHub: https://github.com/waisshaikh

* **Ganesh** – Frontend Developer
  GitHub: https://github.com/CodeWithGanesh1

* **Roshan Nawkar** –Backend Developer
  GitHub: https://github.com/roshannawkar07


---

## 📄 License

This project is for educational / portfolio / internal SaaS use.
