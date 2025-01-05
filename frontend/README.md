# CRM Campaign Management System

A modern, full-stack application for managing email campaigns with real-time status updates.

## Features

-   User Authentication & Authorization
-   Campaign Management (Create, Read, Update, Delete)
-   Email Campaign Execution
-   Real-time Campaign Status Updates
-   Campaign Analytics Dashboard
-   Responsive UI with Modern Design

## Tech Stack

### Frontend

-   Next.js 13+ (React Framework)
-   TypeScript
-   Tailwind CSS
-   Zustand (State Management)
-   Axios (HTTP Client)
-   React Hot Toast (Notifications)
-   Socket.io Client (Real-time Updates)

### Backend

-   NestJS (Node.js Framework)
-   TypeScript
-   MongoDB with Mongoose
-   JWT Authentication
-   RabbitMQ (Message Queue)
-   Nodemailer (Email Service)
-   Socket.io (WebSocket)

## Prerequisites

-   Node.js 22+
-   MongoDB
-   RabbitMQ Server
-   SMTP Server Configuration

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_TINYMCE_API_KEY = your-tinymce-api-key
```

### Backend (.env)

```
# App
PORT=4000
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/crm-campaign

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@example.com
EMAIL_PASSWORD=your-email-password

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_EMAIL_QUEUE=email_queue
```

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/crm-campaign-management.git
cd crm-campaign-management
```

2. Install dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Set up environment variables

-   Create `.env.local` in the frontend directory
-   Create `.env` in the backend directory
-   Add the required environment variables as shown above

4. Start the development servers

```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd frontend
npm run dev
```

5. Access the application

-   Frontend: http://localhost:3000
-   Backend API: http://localhost:4000

## Project Structure

### Frontend

```
src/
├── app/              # Next.js 13+ app directory
├── components/       # Reusable UI components
├── lib/             # Utility functions and configurations
├── store/           # Zustand store configurations
└── types/           # TypeScript type definitions
```

### Backend

```
src/
├── auth/            # Authentication module
├── campaign/        # Campaign management module
├── email-consumer/  # Email processing module
├── util/           # Utility functions and constants
└── main.ts         # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
