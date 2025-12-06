# Alumni Association - Full Stack Setup Guide

This guide will help you set up and run the complete Alumni Association application with backend API, database, and frontend.

## 🏗️ Project Structure

```
Alumni-Association/
├── backend/                 # Node.js Express Backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication & validation
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Email & other services
│   ├── config/            # Database configuration
│   ├── uploads/           # File uploads directory
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env               # Backend environment variables
├── src/                   # React Frontend
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── context/          # React context
│   └── ...
├── .env                  # Frontend environment variables
└── package.json          # Frontend dependencies
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - Choose one option:
   - **Local MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
   - **MongoDB Atlas** (Cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas)
3. **Git** - [Download here](https://git-scm.com/)

### 1. Clone and Setup

```bash
# Navigate to your project directory
cd d:\alumini\Alumni-Association

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 2. Database Setup

#### Option A: Local MongoDB
1. Install and start MongoDB locally
2. MongoDB will run on `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/database`)

### 3. Backend Configuration

Edit `backend/.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/alumni-association
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alumni-association

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration (Gmail SMTP)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Security
BCRYPT_SALT_ROUNDS=12
```

#### Email Setup (Gmail)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

### 4. Frontend Configuration

Edit `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# App Configuration
REACT_APP_APP_NAME=Alumni Association
REACT_APP_VERSION=1.0.0
```

### 5. Running the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
The backend will run on http://localhost:5000

#### Start Frontend (Terminal 2)
```bash
# From the root directory
npm start
```
The frontend will run on http://localhost:3000

### 6. Test the Setup

1. **Backend Health Check**: Visit http://localhost:5000/api/health
2. **Frontend**: Visit http://localhost:3000
3. **Database Connection**: Check the backend terminal for "Connected to MongoDB"

## 📧 Email Configuration Options

### Gmail SMTP (Recommended for Development)
```env
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### SendGrid (Recommended for Production)
```env
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

## 🗄️ Database Models

The application includes the following main models:

1. **User Model** - Authentication, profiles, alumni data
2. **Event Model** - Event management and registration
3. **Gallery Model** - Photo/video gallery with metadata

## 🔐 Authentication Flow

1. **Registration**: Users register with email verification
2. **Email Verification**: Users click link in email to verify
3. **Admin Approval**: Admins approve/reject registrations
4. **Login**: Approved users can log in
5. **JWT Tokens**: Used for API authentication

## 🌟 Key Features

### Backend Features
- ✅ User authentication with JWT
- ✅ Email verification system
- ✅ Role-based access control (Student/Alumni/Admin)
- ✅ Event management and registration
- ✅ Photo/video gallery with comments and likes
- ✅ Contact form with email notifications
- ✅ File upload handling
- ✅ Rate limiting and security middleware
- ✅ MongoDB integration with Mongoose

### Frontend Features
- ✅ React with modern hooks
- ✅ Responsive design with Tailwind CSS
- ✅ Authentication context
- ✅ Alumni directory with filtering
- ✅ Event browsing and registration
- ✅ Photo gallery
- ✅ Contact forms
- ✅ Animations with Framer Motion

## 🔧 Development Commands

### Backend Commands
```bash
cd backend

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Install new packages
npm install package-name
```

### Frontend Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Install new packages
npm install package-name
```

## 📁 Important Files

### Backend
- `server.js` - Main server file
- `models/User.js` - User model with authentication
- `routes/auth.js` - Authentication routes
- `services/emailService.js` - Email functionality
- `middleware/auth.js` - JWT authentication middleware

### Frontend
- `src/services/databaseService.js` - API client
- `src/context/AuthContext.js` - Authentication context
- `src/pages/Register_new.js` - Registration form
- `src/pages/Login.js` - Login form

## 🚨 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
```bash
# Check if MongoDB is running locally
mongosh

# For Atlas, verify connection string and network access
```

**Email Not Sending**
- Verify Gmail app password is correct
- Check if 2FA is enabled on Gmail
- Ensure firewall allows SMTP connections

**Port Already in Use**
```bash
# Find and kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

### Frontend Issues

**API Connection Failed**
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in .env file
- Ensure no CORS issues (backend has CORS enabled)

**Build Errors**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on login/registration
- Input validation and sanitization
- CORS protection
- Helmet security headers
- File upload restrictions

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Alumni
- `GET /api/alumni` - Get all alumni
- `GET /api/alumni/:id` - Get single alumni
- `GET /api/alumni/stats` - Get alumni statistics

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Alumni/Admin)
- `GET /api/events/:id` - Get single event
- `POST /api/events/:id/register` - Register for event

### Gallery
- `GET /api/gallery` - Get gallery items
- `POST /api/gallery` - Upload item (with file)
- `POST /api/gallery/:id/like` - Like/unlike item
- `POST /api/gallery/:id/comment` - Add comment

### Contact
- `POST /api/contact/submit` - Submit contact form

## 🌍 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set environment variables
2. Ensure MongoDB Atlas connection
3. Configure email service
4. Deploy backend code

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `build` folder
3. Set REACT_APP_API_URL to your backend URL

## 📝 Next Steps

1. **Test Registration Flow**: Create a test account
2. **Configure Email**: Set up Gmail or SendGrid
3. **Add Sample Data**: Create events and gallery items
4. **Customize Styling**: Modify Tailwind CSS classes
5. **Add Features**: Implement additional functionality

## 💡 Tips

- Use MongoDB Compass to visualize your database
- Enable MongoDB Atlas IP whitelist for your IP
- Use Postman to test API endpoints
- Check browser developer tools for frontend errors
- Monitor backend logs for debugging

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Ensure all services (MongoDB, email) are configured
4. Check console/terminal logs for error messages

---

**Happy Coding! 🎉**

Your Alumni Association platform is now ready for development and testing!