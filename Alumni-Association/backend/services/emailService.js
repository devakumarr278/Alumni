const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.sendgrid = null;
    this.initialize();
  }

  initialize() {
    try {
      console.log('Initializing email service with env vars:');
      console.log('- EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
      console.log('- EMAIL_USER:', process.env.EMAIL_USER);
      console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? '[SET]' : '[NOT SET]');
      
      // Gmail SMTP Configuration
      if (process.env.EMAIL_SERVICE === 'gmail' && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT) || 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // Use App Password for Gmail
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        console.log('Gmail transporter initialized');
      }
      // Add other email service providers here (SendGrid, etc.)
      else if (process.env.SENDGRID_API_KEY) {
        // SendGrid configuration
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        this.sendgrid = sgMail;
        console.log('SendGrid transporter initialized');
      }
      // Fallback: console logging for development
      else {
        console.log('No email service configured - using console logging fallback');
        this.transporter = {
          sendMail: async (options) => {
            console.log('EMAIL SIMULATION:');
            console.log('To:', options.to);
            console.log('Subject:', options.subject);
            console.log('Content:', options.html.substring(0, 200) + '...');
            return { messageId: 'simulated-message-id' };
          }
        };
      }
      
      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      // Fallback for any errors
      this.transporter = {
        sendMail: async (options) => {
          console.log('EMAIL SIMULATION (ERROR MODE):');
          console.log('To:', options.to);
          console.log('Subject:', options.subject);
          console.log('Content:', options.html.substring(0, 200) + '...');
          return { messageId: 'simulated-message-id' };
        }
      };
    }
  }

  // Verify email service connection
  async verifyConnection() {
    try {
      if (this.transporter && this.transporter.verify) {
        await this.transporter.verify();
        console.log('Email service connection verified');
        return true;
      }
      return true; // For simulated transporters
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }

  // Send email verification (updated to include OTP code)
  async sendVerificationEmail(email, userType, verificationToken, userName, verificationCode = null) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${email}`;
      
      // If no verification code provided, generate one
      if (!verificationCode) {
        verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      }
      
      const mailOptions = {
        from: {
          name: 'Alumni Association',
          address: process.env.EMAIL_USER || 'no-reply@alumni-association.com'
        },
        to: email,
        subject: 'Verify Your Email Address - Alumni Association',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .code { background: #e9e9e9; padding: 15px; border-radius: 4px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 Alumni Association</h1>
                <h2>Email Verification Required</h2>
              </div>
              <div class="content">
                <h3>Hello ${userName}!</h3>
                <p>Thank you for registering as a <strong>${userType}</strong> with our Alumni Association platform.</p>
                
                <h4>Option 1: Click the verification link</h4>
                <p>To complete your registration, please verify your email address by clicking the button below:</p>
                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background: #e9e9e9; padding: 10px; border-radius: 4px;">
                  ${verificationUrl}
                </p>
                
                <h4>Option 2: Enter verification code</h4>
                <p>If you're on a mobile device or prefer to enter a code manually, please use this 6-digit verification code:</p>
                <div class="code">${verificationCode}</div>
                <p>Enter this code on the verification page to complete your registration.</p>
                
                <p><strong>This verification link and code will expire in 24 hours.</strong></p>
                <p>If you didn't create this account, please ignore this email.</p>
                <hr>
                <p>Best regards,<br>Alumni Association Team</p>
              </div>
              <div class="footer">
                <p>This email was sent from Alumni Association. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      if (this.transporter) {
        const result = await this.transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
      } else if (this.sendgrid) {
        const msg = {
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER || 'no-reply@alumni-association.com',
          subject: mailOptions.subject,
          html: mailOptions.html
        };
        await this.sendgrid.send(msg);
        console.log('Verification email sent via SendGrid');
        return { success: true };
      }
      
      // Fallback for development - log email content
      if (process.env.NODE_ENV === 'development') {
        console.log('EMAIL SIMULATION - Verification Email:');
        console.log('To:', email);
        console.log('Subject:', mailOptions.subject);
        console.log('Verification URL:', verificationUrl);
        console.log('Verification Code:', verificationCode);
        console.log('IMPORTANT: In development mode, emails are simulated and not actually sent.');
        console.log('To test real email sending, set NODE_ENV=production in your .env file.');
        return { success: true, message: 'Email simulation logged to console' };
      }
      
      throw new Error('No email service configured');
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, resetToken, userName) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
      
      const mailOptions = {
        from: {
          name: 'Alumni Association',
          address: process.env.EMAIL_USER || 'no-reply@alumni-association.com'
        },
        to: email,
        subject: 'Password Reset Request - Alumni Association',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Alumni Association</h1>
                <h2>Password Reset Request</h2>
              </div>
              <div class="content">
                <h3>Hello ${userName}!</h3>
                <p>We received a request to reset your password for your Alumni Association account.</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background: #e9e9e9; padding: 10px; border-radius: 4px;">
                  ${resetUrl}
                </p>
                <p><strong>This reset link will expire in 1 hour.</strong></p>
                <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
                <hr>
                <p>Best regards,<br>Alumni Association Team</p>
              </div>
              <div class="footer">
                <p>This email was sent from Alumni Association. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      if (this.transporter) {
        const result = await this.transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
      } else if (this.sendgrid) {
        const msg = {
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER || 'no-reply@alumni-association.com',
          subject: mailOptions.subject,
          html: mailOptions.html
        };
        await this.sendgrid.send(msg);
        console.log('Password reset email sent via SendGrid');
        return { success: true };
      }
      
      // Fallback for development - log email content
      if (process.env.NODE_ENV === 'development') {
        console.log('EMAIL SIMULATION - Password Reset Email:');
        console.log('To:', email);
        console.log('Subject:', mailOptions.subject);
        console.log('Reset URL:', resetUrl);
        console.log('IMPORTANT: In development mode, emails are simulated and not actually sent.');
        console.log('To test real email sending, set NODE_ENV=production in your .env file.');
        return { success: true, message: 'Email simulation logged to console' };
      }
      
      throw new Error('No email service configured');
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send admin approval notification
  async sendAdminApprovalNotification(adminEmail, userDetails) {
    try {
      const approvalUrl = `${process.env.FRONTEND_URL}/admin/users/pending`;
      
      const mailOptions = {
        from: {
          name: 'Alumni Association',
          address: process.env.EMAIL_USER || 'no-reply@alumni-association.com'
        },
        to: adminEmail,
        subject: 'New User Registration Pending Approval - Alumni Association',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New User Registration</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .user-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
              .button { display: inline-block; background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>👥 Alumni Association</h1>
                <h2>New User Registration</h2>
              </div>
              <div class="content">
                <h3>New ${userDetails.userType} Registration</h3>
                <p>A new user has registered and is pending approval:</p>
                <div class="user-details">
                  <p><strong>Name:</strong> ${userDetails.fullName}</p>
                  <p><strong>Email:</strong> ${userDetails.email}</p>
                  <p><strong>User Type:</strong> ${userDetails.userType}</p>
                  <p><strong>College:</strong> ${userDetails.collegeName}</p>
                  <p><strong>Roll Number:</strong> ${userDetails.rollNumber}</p>
                  <p><strong>Department:</strong> ${userDetails.department}</p>
                  <p><strong>Registration Date:</strong> ${new Date(userDetails.createdAt).toLocaleDateString()}</p>
                </div>
                <p>Please review and approve/reject this registration:</p>
                <div style="text-align: center;">
                  <a href="${approvalUrl}" class="button">Review Registration</a>
                </div>
                <hr>
                <p>Best regards,<br>Alumni Association System</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      if (this.transporter) {
        const result = await this.transporter.sendMail(mailOptions);
        console.log('Admin notification email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
      } else if (this.sendgrid) {
        const msg = {
          to: adminEmail,
          from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER || 'no-reply@alumni-association.com',
          subject: mailOptions.subject,
          html: mailOptions.html
        };
        await this.sendgrid.send(msg);
        console.log('Admin notification email sent via SendGrid');
        return { success: true };
      }
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        console.log('EMAIL SIMULATION - Admin Notification:');
        console.log('To:', adminEmail);
        console.log('Subject:', mailOptions.subject);
        console.log('IMPORTANT: In development mode, emails are simulated and not actually sent.');
        console.log('To test real email sending, set NODE_ENV=production in your .env file.');
        return { success: true, message: 'Email simulation logged to console' };
      }
      
      throw new Error('No email service configured');
    } catch (error) {
      console.error('Failed to send admin notification email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email after approval
  async sendWelcomeEmail(email, userName, userType) {
    try {
      const loginUrl = `${process.env.FRONTEND_URL}/login`;
      
      const mailOptions = {
        from: {
          name: 'Alumni Association',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Welcome to Alumni Association! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Alumni Association</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .features { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 Welcome to Alumni Association!</h1>
              </div>
              <div class="content">
                <h3>Congratulations ${userName}!</h3>
                <p>Your ${userType} account has been approved and activated. Welcome to our Alumni Association community!</p>
                
                <div class="features">
                  <h4>What you can do now:</h4>
                  <ul>
                    <li>Connect with fellow alumni and students</li>
                    <li>Discover and register for upcoming events</li>
                    <li>Browse our photo gallery and memories</li>
                    <li>Update your professional profile</li>
                    <li>Participate in networking opportunities</li>
                  </ul>
                </div>
                
                <p>Get started by logging into your account:</p>
                <div style="text-align: center;">
                  <a href="${loginUrl}" class="button">Login to Your Account</a>
                </div>
                
                <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
                <hr>
                <p>Best regards,<br>Alumni Association Team</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      if (this.transporter) {
        const result = await this.transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
      } else if (this.sendgrid) {
        const msg = {
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: mailOptions.subject,
          html: mailOptions.html
        };
        await this.sendgrid.send(msg);
        console.log('Welcome email sent via SendGrid');
        return { success: true };
      }
      
      throw new Error('No email service configured');
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send contact form notification
  async sendContactFormNotification(contactData) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      
      const mailOptions = {
        from: {
          name: 'Alumni Association Contact Form',
          address: process.env.EMAIL_USER
        },
        to: adminEmail,
        subject: `New Contact Form Submission - ${contactData.subject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Form Submission</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .form-data { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📧 Contact Form Submission</h1>
              </div>
              <div class="content">
                <p>A new contact form has been submitted:</p>
                <div class="form-data">
                  <p><strong>Name:</strong> ${contactData.name}</p>
                  <p><strong>Email:</strong> ${contactData.email}</p>
                  <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
                  <p><strong>Subject:</strong> ${contactData.subject}</p>
                  <p><strong>Message:</strong></p>
                  <p style="background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea;">
                    ${contactData.message}
                  </p>
                  <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <p>Please respond to this inquiry at your earliest convenience.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        replyTo: contactData.email
      };

      if (this.transporter) {
        const result = await this.transporter.sendMail(mailOptions);
        console.log('Contact form notification sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
      } else if (this.sendgrid) {
        const msg = {
          to: adminEmail,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: mailOptions.subject,
          html: mailOptions.html,
          replyTo: contactData.email
        };
        await this.sendgrid.send(msg);
        console.log('Contact form notification sent via SendGrid');
        return { success: true };
      }
      
      throw new Error('No email service configured');
    } catch (error) {
      console.error('Failed to send contact form notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send alumni approval notification
  async sendAlumniApprovalNotification(alumniEmail, details) {
    try {
      const loginUrl = `${process.env.FRONTEND_URL}/login`;
      
      const mailOptions = {
        from: {
          name: 'Alumni Association',
          address: process.env.EMAIL_USER
        },
        to: alumniEmail,
        subject: '🎉 Your Alumni Account Has Been Approved!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Alumni Account Approved</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .verification-badge { background: #27ae60; color: white; padding: 5px 10px; border-radius: 20px; font-size: 14px; display: inline-block; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 Congratulations ${details.fullName}!</h1>
              </div>
              <div class="content">
                <p>Great news! Your alumni account has been successfully ${details.method === 'ai' ? 'auto-approved' : 'approved'}.</p>
                
                <div style="text-align: center;">
                  <span class="verification-badge">✅ Account Verified</span>
                </div>
                
                <p>You can now access all alumni features including:</p>
                <ul>
                  <li>Connect with fellow alumni</li>
                  <li>Discover and register for events</li>
                  <li>Browse our photo gallery</li>
                  <li>Update your professional profile</li>
                  <li>Participate in networking opportunities</li>
                </ul>
                
                <p>Get started by logging into your account:</p>
                <div style="text-align: center;">
                  <a href="${loginUrl}" class="button">Login to Your Account</a>
                </div>
                
                <p>If you have any questions, please don't hesitate to contact us.</p>
                <hr>
                <p>Best regards,<br>Alumni Association Team</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      if (this.transporter) {
        const result = await this.transporter.sendMail(mailOptions);
        console.log('Alumni approval notification sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
      } else if (this.sendgrid) {
        const msg = {
          to: alumniEmail,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: mailOptions.subject,
          html: mailOptions.html
        };
        await this.sendgrid.send(msg);
        console.log('Alumni approval notification sent via SendGrid');
        return { success: true };
      }
      
      throw new Error('No email service configured');
    } catch (error) {
      console.error('Failed to send alumni approval notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send alumni rejection notification
  async sendAlumniRejectionNotification(alumniEmail, details) {
    try {
      const supportUrl = `${process.env.FRONTEND_URL}/contact`;
      
      const mailOptions = {
        from: {
          name: 'Alumni Association',
          address: process.env.EMAIL_USER
        },
        to: alumniEmail,
        subject: 'Your Alumni Account Registration Update',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Alumni Account Status</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .rejection-badge { background: #e74c3c; color: white; padding: 5px 10px; border-radius: 20px; font-size: 14px; display: inline-block; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1> Alumni Account Status Update</h1>
              </div>
              <div class="content">
                <p>Dear ${details.fullName},</p>
                
                <div style="text-align: center;">
                  <span class="rejection-badge">⚠️ Account Not Approved</span>
                </div>
                
                <p>We regret to inform you that your alumni account registration has not been approved at this time.</p>
                
                <p>This could be due to:</p>
                <ul>
                  <li>Information mismatch with our records</li>
                  <li>Incomplete documentation</li>
                  <li>Verification issues</li>
                </ul>
                
                <p>If you believe this is an error, or if you would like to provide additional information, please contact our support team:</p>
                <div style="text-align: center;">
                  <a href="${supportUrl}" class="button">Contact Support</a>
                </div>
                
                <p>We appreciate your interest in joining our alumni community and hope to resolve this matter soon.</p>
                <hr>
                <p>Best regards,<br>Alumni Association Team</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      if (this.transporter) {
        const result = await this.transporter.sendMail(mailOptions);
        console.log('Alumni rejection notification sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
      } else if (this.sendgrid) {
        const msg = {
          to: alumniEmail,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: mailOptions.subject,
          html: mailOptions.html
        };
        await this.sendgrid.send(msg);
        console.log('Alumni rejection notification sent via SendGrid');
        return { success: true };
      }
      
      throw new Error('No email service configured');
    } catch (error) {
      console.error('Failed to send alumni rejection notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send institution notification for new alumni registration
  async sendInstitutionNotification(institutionEmail, alumniDetails) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/institution/alumni-verification`;
      
      const mailOptions = {
        from: {
          name: 'Alumni Association',
          address: process.env.EMAIL_USER
        },
        to: institutionEmail,
        subject: 'New Alumni Registration Awaiting Verification',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Alumni Registration</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .pending-badge { background: #f39c12; color: white; padding: 5px 10px; border-radius: 20px; font-size: 14px; display: inline-block; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>👥 New Alumni Registration</h1>
              </div>
              <div class="content">
                <p>A new alumni registration is awaiting your verification:</p>
                
                <div style="text-align: center;">
                  <span class="pending-badge">⏳ Pending Verification</span>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>Name:</strong> ${alumniDetails.fullName}</p>
                  <p><strong>Email:</strong> ${alumniDetails.email}</p>
                  <p><strong>College:</strong> ${alumniDetails.collegeName}</p>
                  <p><strong>Department:</strong> ${alumniDetails.department}</p>
                  <p><strong>Graduation Year:</strong> ${alumniDetails.graduationYear}</p>
                  <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <p>Please review and verify this alumni registration:</p>
                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">Verify Alumni</a>
                </div>
                
                <p>Thank you for maintaining the quality of our alumni community.</p>
                <hr>
                <p>Best regards,<br>Alumni Association System</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      if (this.transporter) {
        const result = await this.transporter.sendMail(mailOptions);
        console.log('Institution notification sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
      } else if (this.sendgrid) {
        const msg = {
          to: institutionEmail,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: mailOptions.subject,
          html: mailOptions.html
        };
        await this.sendgrid.send(msg);
        console.log('Institution notification sent via SendGrid');
        return { success: true };
      }
      
      throw new Error('No email service configured');
    } catch (error) {
      console.error('Failed to send institution notification:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create and export singleton instance
const emailService = new EmailService();

module.exports = emailService;