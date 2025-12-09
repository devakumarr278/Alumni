# Alumni Association Portal

A comprehensive platform connecting alumni, students, and institutions for mentorship, career guidance, and networking.

## Features

- **Alumni Directory**: Search and connect with alumni based on skills, location, and expertise
- **Mentorship Program**: Structured mentorship matching with calendar scheduling
- **Career Roadmaps**: Personalized learning paths for career development
- **Event Management**: Create and join alumni events, workshops, and networking sessions
- **Job Board**: Post and apply for job opportunities
- **Badges & Recognition**: Earn badges for participation and achievements
- **Communication Tools**: Messaging and notification system
- **Institution Portal**: Dedicated dashboard for institutional administrators

## Tech Stack

### Frontend
- React.js with modern hooks
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with Express.js
- MongoDB with Mongoose for data persistence
- WebSocket for real-time communication
- JWT for authentication
- Nodemailer for email notifications

### Additional Services
- SendGrid for transactional emails
- Cloudinary for image storage (optional)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

### Frontend Setup
```bash
npm install
npm start
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
PORT=5001
```

## Project Structure

```
alumni-association/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── src/
│   ├── components/
│   ├── pages/
│   │   └── studentpart/
│   │       └── CareerRoadmap.jsx
│   ├── services/
│   └── App.js
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/verify-email` - Email verification

### Alumni
- GET `/api/alumni` - Get all alumni
- GET `/api/alumni/:id` - Get specific alumni
- PUT `/api/alumni/:id` - Update alumni profile

## Development

### Running Tests
```bash
cd backend
npm test
```

### Linting
```bash
npm run lint
```

## Deployment

The application can be deployed to any cloud platform that supports Node.js and MongoDB:

1. Set up MongoDB database (Atlas recommended)
2. Set environment variables
3. Deploy backend and frontend separately
4. Configure domain and SSL certificates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue on GitHub.