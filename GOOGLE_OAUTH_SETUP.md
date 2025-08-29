# 🔐 Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your poker dashboard.

## 📋 Prerequisites

- Google Cloud Console account
- Access to your project's environment variables

## 🚀 Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "Poker Dashboard OAuth")
4. Click "Create"

### 2. Enable Google+ API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google OAuth2 API"
3. Click on it and click "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen first:
   - User Type: External
   - App name: Your app name
   - User support email: Your email
   - Developer contact information: Your email
   - Save and continue

4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: "Poker Dashboard Web Client"
   - Authorized redirect URIs: 
     - `http://localhost:3000/api/auth/login/google/callback` (for development)
     - `https://yourdomain.com/api/auth/login/google/callback` (for production)

5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

### 4. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/login/google/callback
```

### 5. Test the Integration

1. Start your development server: `pnpm dev`
2. Go to `/en/login` or `/en/(auth)/login`
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected back to your dashboard

## 🔧 Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" Error**
   - Ensure the redirect URI in Google Console matches exactly
   - Check for trailing slashes or protocol mismatches

2. **"invalid_client" Error**
   - Verify your Client ID and Client Secret are correct
   - Ensure the credentials are for a Web application, not Desktop

3. **"access_denied" Error**
   - Check if the Google+ API is enabled
   - Verify your OAuth consent screen is configured

### Security Notes

- Never commit your `.env.local` file to version control
- Use different OAuth credentials for development and production
- Regularly rotate your Client Secret
- Monitor your OAuth usage in Google Cloud Console

## 📱 Production Deployment

When deploying to production:

1. Update the redirect URI in Google Console to your production domain
2. Update `GOOGLE_REDIRECT_URI` in your production environment
3. Ensure your domain is verified in Google Cloud Console
4. Consider restricting OAuth to specific domains if needed

## 🎯 Features

With Google OAuth, users can:

- ✅ Sign in with their Google account
- ✅ Automatically create accounts (if they don't exist)
- ✅ Link existing accounts (if email matches)
- ✅ Access their profile picture and verified email
- ✅ Seamless authentication experience

## 🔗 Related Files

- `src/lib/server/auth/google.ts` - Google OAuth configuration
- `src/app/api/auth/login/google/route.ts` - OAuth initiation
- `src/app/api/auth/login/google/callback/route.ts` - OAuth callback
- `src/components/layout/auth-form.tsx` - Login form with Google button
- `prisma/schema.prisma` - Database schema with googleId field

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your environment variables are loaded
3. Ensure your database schema is up to date
4. Check Google Cloud Console for any API restrictions

---

**Happy coding! 🚀**
