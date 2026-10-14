@echo off
echo Setting up Carhub with Email Notifications...
echo.

echo Installing dependencies...
npm install
echo.

echo Creating .env file from example...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please edit it with your email credentials.
) else (
    echo .env file already exists.
)
echo.

echo Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your Gmail credentials
echo 2. Run 'npm start' to start the email server
echo 3. Open index.html in your browser
echo.
echo For Gmail setup:
echo - Enable 2FA on your Google account
echo - Generate an App Password: https://support.google.com/accounts/answer/185833
echo - Use the App Password in EMAIL_PASS
echo.
pause