# 🔥 Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your admin panel to ensure only you can access it.

## 📋 Prerequisites

- A Google account
- Your portfolio project running locally

## 🚀 Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Create a project"**
3. **Enter project name**: `portfolio-admin` (or any name you prefer)
4. **Disable Google Analytics** (not needed for this project)
5. **Click "Create project"**

## 🔐 Step 2: Enable Authentication

1. **In your Firebase project**, click **"Authentication"** in the left sidebar
2. **Click "Get started"**
3. **Go to "Sign-in method" tab**
4. **Enable "Email/Password"**:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## 👤 Step 3: Create Your Admin Account

1. **Go to "Users" tab** in Authentication
2. **Click "Add user"**
3. **Enter your email and password**:
   - Email: `your-email@example.com` (use your real email)
   - Password: Create a strong password
4. **Click "Add user"**

## ⚙️ Step 4: Get Firebase Configuration

1. **Go to Project Settings** (gear icon in left sidebar)
2. **Scroll down to "Your apps"**
3. **Click the web icon** `</>`
4. **Register your app**:
   - App nickname: `Portfolio Admin`
   - Don't check "Firebase Hosting"
   - Click "Register app"
5. **Copy the configuration object** (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 🔧 Step 5: Update Environment Variables

1. **Open your `.env` file** in the project root
2. **Replace the Firebase configuration values**:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Admin Configuration
VITE_ADMIN_EMAIL=your-email@example.com
```

3. **Replace `your-email@example.com`** with the email you used to create the admin account

## 🔒 Step 6: Security Rules (Optional but Recommended)

1. **Go to Firestore Database** (if you plan to use it later)
2. **Set up security rules** to restrict access

## ✅ Step 7: Test the Setup

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Go to the admin login**: http://localhost:5173/admin/login

3. **Try logging in** with your Firebase credentials

4. **You should be redirected** to the admin dashboard

## 🚨 Important Security Notes

- ✅ **Only authorized emails** can access the admin panel
- ✅ **Firebase handles password security** and encryption
- ✅ **Environment variables** keep your config secure
- ✅ **Authentication state** is managed automatically
- ✅ **Logout functionality** clears all sessions

## 🔧 Troubleshooting

### "Firebase not configured" error
- Check that all environment variables are set correctly
- Restart your development server after updating `.env`

### "Unauthorized user" error
- Make sure your email is added to `VITE_ADMIN_EMAIL`
- Check that the email matches exactly (case-sensitive)

### "Authentication failed" error
- Verify your email and password in Firebase Console
- Check that Email/Password authentication is enabled

## 🎯 Next Steps

Your admin panel is now secured with Firebase Authentication! Only users with accounts you create in Firebase Console can access it.

**To add more admin users:**
1. Go to Firebase Console > Authentication > Users
2. Click "Add user"
3. Add their email to the authorized list in `firebaseAuthService.js`

**For production deployment:**
- Set up environment variables on your hosting platform
- Consider adding additional security rules
- Enable email verification if needed
