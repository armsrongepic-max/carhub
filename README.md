# Carhub - Car Marketplace

A comprehensive car marketplace platform with email notifications, user authentication, and seller dashboard.

## Features

- ✅ User authentication (signup/login)
- ✅ Car listings with image upload
- ✅ Seller dashboard
- ✅ Admin panel
- ✅ Email notifications
- ✅ WhatsApp integration
- ✅ Responsive design
- ✅ Dark mode
- ✅ Favorites and comparison
- ✅ Reviews and ratings

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Email Settings

Create a `.env` file in the root directory:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@carhub.com
```

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an App Password: https://support.google.com/accounts/answer/185833
3. Use the App Password (not your regular password) in EMAIL_PASS

### 3. Start the Email Server

```bash
npm start
```

The server will run on http://localhost:3001

### 4. Open the Application

Open `index.html` in your browser. The frontend will communicate with the email server for notifications.

## Email Notification Features

### Contact Form
- Sends email to admin when users submit contact form
- Sends confirmation email to user
- Falls back to WhatsApp + mailto if server is unavailable

### Car Inquiries
- Notifies seller when buyer shows interest
- Sends confirmation to buyer
- Includes car details and contact information

### Admin Notifications
- All system activities are logged
- Email queue can be viewed at `/api/email-queue`

## API Endpoints

- `POST /api/contact` - Send contact form
- `POST /api/car-inquiry` - Send car inquiry notification
- `GET /api/email-queue` - View sent emails (admin)

## File Structure

```
carhub/
├── index.html          # Homepage
├── listings.html       # Car listings page
├── admin.html          # Admin panel
├── seller-dashboard.html # Seller dashboard
├── reviews.html        # Reviews page
├── app.js              # Homepage JavaScript
├── listings.js         # Listings page JavaScript
├── styles.css          # Main styles
├── server.js           # Email notification server
├── package.json        # Node.js dependencies
└── README.md           # This file
```

## Development

For development with auto-restart:

```bash
npm run dev
```

## Production Deployment

1. Set up environment variables on your hosting platform
2. Use a production email service (SendGrid, Mailgun, etc.)
3. Configure CORS for your domain
4. Set up proper error handling and logging

## Security Notes

- This demo uses localStorage for user sessions (not secure for production)
- Email credentials are stored in environment variables
- Consider implementing JWT tokens for production authentication
- Use HTTPS in production

## License

MIT License