# Email Service Configuration

The Alumni Association backend supports multiple email services. This document explains how to configure them.

## Supported Email Services

1. **Gmail** - Uses Gmail SMTP
2. **SendGrid** - Uses SendGrid API
3. **Development Fallback** - Console logging (default for development)

## Environment Variables

Create a `.env` file in the backend directory with the appropriate configuration:

### Gmail Configuration

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

**Important Gmail Setup Instructions**:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password specifically for this application:
   - Go to Google Account Settings
   - Navigate to Security > App passwords
   - Select "Mail" and your device/app
   - Use the generated 16-character password (without spaces) as your EMAIL_PASS
3. Never use your regular Gmail password with SMTP - it will not work

### SendGrid Configuration

```env
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-verified-sender@yourdomain.com
```

### Fallback Development Mode

If no email service is configured, the application will:
1. Log email content to the console in development mode
2. Return success responses to maintain API functionality

## Testing Email Configuration

Run the test script to verify your email configuration:

```bash
cd backend
node testEmailDelivery.js
```

## Troubleshooting

### Gmail Authentication Issues

If you see "Username and Password not accepted" errors:
1. Ensure you're using an App Password, not your regular Gmail password
2. Check that 2-Factor Authentication is enabled on your Google account
3. Generate a new App Password and update your [.env](file:///D:/alumini/Alumni-Association/backend/.env) file
4. Make sure there are no extra spaces in the App Password

### Emails Not Received

If emails are sending successfully but not arriving:
1. Check your spam/junk folder
2. Add your sender email to your contacts
3. Verify your email provider's filtering rules
4. Test with different email addresses

## Error Handling

The email service includes comprehensive error handling:
- Failed email sends are logged with detailed error messages
- API endpoints return appropriate HTTP status codes
- Development environments use console logging as a fallback