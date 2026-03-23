Finance Tracker
A modern, full-stack personal finance management application. This project allows users to track their income and expenses with a clean, responsive dashboard and secure authentication features like OTP verification.

🛠️ Features
Secure Authentication: Sign up and sign in with JWT-based sessions.

OTP Verification: Email-based One-Time Passwords for account verification and password resets.

Profile Management: Users can update their security settings and change passwords securely.

Transaction Tracking: Manage financial records through a dedicated dashboard.

Responsive Design: Built with Tailwind CSS for a seamless experience across devices.

📂 Project Structure
The project is split into two main directories:

backend/: Node.js and Express server handling the API and database.

frontend/: React application built with Vite and Tailwind CSS.

🚀 Getting Started
1. Backend Setup

Navigate to the backend folder:
Bash
cd backend

Install dependencies:
Bash
npm install

Configure Environment Variables:
Create a .env file in the backend/ directory and add your credentials:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

Start the server:
Bash
npm start

2. Frontend Setup
Navigate to the frontend folder:
Bash
cd frontend

Install dependencies:
Bash
npm install

Start the development server:
Bash
npm run dev

Open the app:
Visit http://localhost:5173 in your browser.

🧰 Tech Stack
Frontend: React, Vite, Tailwind CSS, Lucide React, Axios.

Backend: Node.js, Express, Mongoose (MongoDB), Nodemailer.
