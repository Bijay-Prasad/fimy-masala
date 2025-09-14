# Movie Review Platform

A full-stack MERN application for movie reviews, ratings, and social features. Users can browse movies, write reviews, manage watchlists, and follow other users.

## Features

- 🎬 **Movie Browsing**: Search, filter, and sort movies by genre, year, rating
- ⭐ **Reviews & Ratings**: Rate and review movies (1-5 stars)
- 📝 **User Profiles**: Personal profiles with review history and watchlists
- 👥 **Social Features**: Follow/unfollow other users
- 📋 **Watchlist**: Save movies to watch later
- 🔐 **Authentication**: Secure JWT-based login/registration
- 👨‍💼 **Admin Panel**: Manage users, movies, and reviews

## Tech Stack

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React 19 with Vite
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-review-platform
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/movie-review-platform
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   ```

5. **Start the Application**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/movies` - Get all movies (with filtering)
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies/:id/reviews` - Add review to movie
- `GET /api/users/:id` - Get user profile
- `POST /api/users/:id/watchlist` - Add to watchlist
- `POST /api/social/follow/:userId` - Follow user

## Project Structure

```
movie-review-platform/
├── server/                 # Backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Auth middleware
│   └── server.js          # Entry point
├── client/                # Frontend
│   ├── src/
│   │   ├── pages/         # React pages
│   │   ├── components/    # Reusable components
│   │   ├── redux/         # State management
│   │   └── services/      # API services
│   └── package.json
└── README.md
```

## Development

- **Backend**: Uses nodemon for auto-restart during development
- **Frontend**: Vite provides fast HMR (Hot Module Replacement)
- **Database**: MongoDB with Mongoose ODM

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.