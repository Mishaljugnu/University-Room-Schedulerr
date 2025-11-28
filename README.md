
# UM Surabaya Room Scheduler

A modern application for managing room bookings and schedules at Universitas Muhammadiyah Surabaya.

## Project Overview

This application allows teachers to book classrooms and admins to manage buildings, rooms, and bookings across the university campus.

### Key Features

- Teacher dashboard for booking classrooms
- Admin dashboard for managing buildings, classrooms, and users
- Role-based access control
- Real-time availability checking
- Booking management system

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI components
- **Backend**: Node.js, Express
- **Authentication**: JWT-based auth system

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd room-scheduler
```

2. Install frontend dependencies and start the development server

```bash
npm install
npm run dev
```

3. Install backend dependencies and start the server

```bash
cd server
npm install
npm run dev
```

## Development

### Frontend Structure

The frontend is organized as follows:

```
src/
├── components/      # Reusable UI components
│   ├── admin/       # Admin-specific components
│   ├── auth/        # Authentication components
│   ├── layout/      # Layout components like Navbar, Sidebar
│   └── ui/          # UI components from shadcn
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── pages/           # Page components
│   ├── admin/       # Admin pages
│   └── teacher/     # Teacher pages
└── utils/           # Utility functions
```

### Backend Structure

The backend is organized as follows:

```
server/
├── index.js         # Main Express server file
├── mockData.js      # Mock data for development
└── package.json     # Backend dependencies
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK_DATA=false
VITE_APP_NAME=UM Surabaya Room Scheduler
```

## Deployment

1. Build the frontend

```bash
npm run build
```

2. Start the production server

```bash
cd server
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
