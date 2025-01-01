# CRM Campaign Management Project

This is a full-stack application with a NestJS backend and a Next.js frontend.

## Backend

The backend is built with NestJS and includes the following features:

-   User Authentication (Login/Register)
-   Campaign Management
-   Real-time Updates using WebSocket
-   MongoDB Database Integration
-   JWT Authentication
-   Environment Configuration

### Prerequisites

-   Node.js (v20 or higher)
-   MongoDB
-   RabbitMQ
-   npm

### Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `example.env` and configure your environment variables:

```bash
cp example.env .env
```

4. Start the development server:

```bash
npm run start:dev
```

The server will start running at `http://localhost:3000`

### API Endpoints

-   **Auth**

    -   POST `/auth/register` - Register new user
    -   POST `/auth/login` - User login

-   **Campaign**
    -   POST `/campaign` - Create new campaign
    -   GET `/campaign` - Get all campaigns
    -   GET `/campaign/:id` - Get specific campaign
    -   PATCH `/campaign/:id` - Update campaign
    -   DELETE `/campaign/:id` - Delete campaign

### WebSocket Events

The application uses WebSocket for real-time updates on campaign changes.

## Frontend (Coming Soon)

The frontend part of the application will be implemented soon with modern web technologies.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
