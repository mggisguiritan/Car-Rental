# DriveX - Premium Car Rental System

A full-stack car rental web application with modern design and robust backend architecture.

## Tech Stack

### Frontend
- **React** (Vite) + TypeScript
- **Tailwind CSS** for layout and utility styling
- **Material UI (MUI)** for components
- **React Router** for routing
- **Axios** for API calls
- **TanStack Query** for data fetching and caching
- **Framer Motion** for animations

### Backend
- **NestJS** (TypeScript)
- **Prisma ORM**
- **MySQL** database
- **JWT Authentication**
- **REST API architecture**

## Project Structure

```
car_rental/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/    # Authentication (register, login, JWT)
│   │   ├── users/   # User management
│   │   ├── cars/    # Car CRUD
│   │   ├── bookings/# Booking management
│   │   └── prisma/   # Prisma service
│   └── prisma/      # Database schema
└── frontend/        # React app
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Application pages
    │   ├── services/    # API services
    │   ├── hooks/       # Custom React hooks
    │   └── context/     # React context providers
    └── public/
```

## Features

### User Features
- User registration and login
- Browse available cars
- View car details
- Book cars with date selection
- View and cancel bookings
- Dynamic price calculation

### Admin Features
- Add/edit/delete cars
- View all bookings
- Update booking status (PENDING → CONFIRMED/CANCELLED)

### Booking Logic
- Prevents overlapping bookings for the same car
- Automatic price calculation (days × pricePerDay)

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |

### Cars
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/cars` | List all cars | Public |
| GET | `/cars/:id` | Get car details | Public |
| POST | `/cars` | Create car | Admin |
| PATCH | `/cars/:id` | Update car | Admin |
| DELETE | `/cars/:id` | Delete car | Admin |

### Bookings
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/bookings` | Create booking | User |
| GET | `/bookings/my` | User's bookings | User |
| GET | `/bookings` | All bookings | Admin |
| PATCH | `/bookings/:id/status` | Update status | Admin |

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DATABASE_URL="mysql://user:password@localhost:3306/car_rental"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Push schema to database:
```bash
npx prisma db push
```

6. Start development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API base URL in `src/services/api.ts` if needed (default: `http://localhost:3000`)

4. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Default Admin Account

After setup, create an admin user via API:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Admin", "email": "admin@example.com", "password": "admin123", "role": "ADMIN"}'
```

## Database Models

### User
- `id` - Auto-incremented primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password (bcrypt)
- `role` - USER or ADMIN
- `createdAt` - Account creation timestamp

### Car
- `id` - Auto-incremented primary key
- `name` - Car name/model
- `brand` - Car brand
- `pricePerDay` - Rental price per day
- `image` - Image URL
- `available` - Availability status
- `createdAt` - Creation timestamp

### Booking
- `id` - Auto-incremented primary key
- `userId` - Foreign key to User
- `carId` - Foreign key to Car
- `startDate` - Rental start date
- `endDate` - Rental end date
- `totalPrice` - Calculated total price
- `status` - PENDING, CONFIRMED, or CANCELLED
- `createdAt` - Booking timestamp

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (USER/ADMIN)
- Protected routes with guards
- Input validation with class-validator

## UI/UX Features

- Modern, Apple/Tesla-inspired design
- Responsive mobile-first layout
- Smooth Framer Motion animations
- Loading skeletons
- Toast notifications
- Form validation
- Error handling UI

## Demo Data

The backend includes a seed script to populate sample cars. To run it:
```bash
cd backend
npm run db:seed
```

## License

MIT License