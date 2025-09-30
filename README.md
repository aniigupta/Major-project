# Major Project - Food Ordering Web Application

## Table of Contents

* [Project Overview](#project-overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [Usage](#usage)
* [Demo Account](#demo-account)
* [Folder Structure](#folder-structure)
* [API Endpoints](#api-endpoints)
* [Authentication Flow](#authentication-flow)
* [Contribution](#contribution)
* [License](#license)

## Project Overview

This is a full-stack **food ordering web application**. Users can browse restaurants, view menus, filter items by cuisine, place orders, and manage their accounts. Admins can manage restaurants, menu items, and orders through a dedicated interface.

## Features

* User registration and login (Email + OTP, Google OAuth)
* Email verification
* Secure password management and reset
* Browse restaurants and menus
* Filter menu items by cuisine
* Add items to cart and place orders
* Admin panel to manage restaurants, menu items, and orders
* Email notifications for registration and order updates
* File uploads for menu images using Multer
* State management using custom hooks and Zustand stores

## Tech Stack

* **Frontend:** React.js, TypeScript, Tailwind CSS, Vite
* **Backend:** Node.js, Express.js, TypeScript
* **Database:** MongoDB
* **Authentication:** JWT, Google OAuth
* **Email Service:** Mailtrap
* **File Uploads:** Multer, Cloudinary

## Installation

1. Clone the repository:

```bash
git clone https://github.com/aniigupta/Major-project.git
cd Major-project
```

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Install frontend dependencies:

```bash
cd ../client
npm install
```

4. Setup environment variables in `.env`:

```env
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
MAILTRAP_USER=<your_mailtrap_user>
MAILTRAP_PASS=<your_mailtrap_pass>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_cloud_api_key>
CLOUDINARY_API_SECRET=<your_cloud_api_secret>
```

## Usage

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

Open your browser at `http://localhost:5173`.

## Demo Account

You can use the following demo account to test the application:

* **Username:** `apple@gmail.com`
* **Password:** `apple@123`

> Note: This account has pre-registered user access. For admin features, register a new account and update the role in the database manually.

## Folder Structure

```
Major-project/
├── server/
│   ├── controller/
│   ├── db/
│   ├── mailtrap/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.ts
├── client/
│   ├── src/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── layout/
│   │   ├── lib/
│   │   ├── schema/
│   │   ├── store/
│   │   ├── types/
│   │   └── App.tsx
│   ├── public/
│   ├── index.html
│   └── vite.config.ts
└── .env
```

## API Endpoints

### User

* `POST /user/register`
* `POST /user/login`
* `POST /user/verify-email`
* `POST /user/forgot-password`
* `POST /user/reset-password`

### Restaurant

* `GET /restaurant`
* `POST /restaurant` (Admin)
* `PUT /restaurant/:id` (Admin)
* `DELETE /restaurant/:id` (Admin)

### Menu

* `GET /menu`
* `GET /menu/:restaurantId`
* `POST /menu` (Admin)
* `PUT /menu/:id` (Admin)
* `DELETE /menu/:id` (Admin)

### Order

* `POST /order`
* `GET /order/:userId`
* `GET /orders` (Admin)

## Authentication Flow

1. User registers via email or Google OAuth
2. Verification email is sent via Mailtrap
3. User verifies email and logs in
4. JWT token is issued for protected routes

## Contribution

Fork the repository, create feature branches, and submit pull requests. Follow clean code practices and maintain folder structure.
