# 🗄️ Supabase Database Integration Guide

## Overview
Your portfolio now includes a complete Supabase integration for managing certificates, education, and experience data with full CRUD operations from your admin panel.

## 🚀 Setup Instructions

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a project name (e.g., "portfolio-db")
4. Set a strong database password
5. Select a region close to you

### Step 2: Set Up Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL commands
4. This will create:
   - `certificates` table
   - `education` table  
   - `experience` table
   - Proper indexes and triggers
   - Sample data

### Step 3: Configure Environment Variables
1. In Supabase dashboard, go to **Settings > API**
2. Copy your **Project URL** and **anon public key**
3. Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Test the Integration
1. Restart your development server: `npm run dev`
2. Go to `/admin/login` and login
3. You should see new tabs for managing data

## 📊 Database Schema

### Certificates Table
- `id` - UUID primary key
- `title` - Certificate name
- `issuer` - Issuing organization
- `issue_date` - When issued
- `credential_url` - Link to verify
- `skills` - Array of skills learned
- `is_featured` - Show on main site

### Education Table
- `id` - UUID primary key
- `institution` - School/University name
- `degree` - Degree type
- `start_year/end_year` - Duration
- `is_current` - Currently studying
- `achievements` - Notable accomplishments

### Experience Table
- `id` - UUID primary key
- `company` - Company name
- `position` - Job title
- `start_date/end_date` - Employment period
- `responsibilities` - Key duties
- `technologies` - Tech stack used

## 🔧 Admin Panel Features

### Data Management Tabs
1. **Projects** - GitHub repository management
2. **Certificates** - Add/edit/delete certificates
3. **Education** - Manage educational background
4. **Experience** - Handle work experience

### CRUD Operations
- ✅ **Create** - Add new records
- ✅ **Read** - View all data
- ✅ **Update** - Edit existing records
- ✅ **Delete** - Remove records
- ✅ **Real-time sync** with website

## 🌐 Frontend Integration

### Automatic Data Fetching
The website will automatically:
- Fetch data from Supabase on page load
- Display certificates, education, and experience
- Update in real-time when admin makes changes

### Resume Page Integration
The `/resume` page will now show:
- Live data from your Supabase database
- Filterable by type and year
- Always up-to-date information

## 🔒 Security Features

### Row Level Security (RLS)
- Public read access for website visitors
- Admin-only write access
- Secure data handling

### Environment Variables
- API keys stored securely
- No sensitive data in code
- Production-ready configuration

## 📱 Usage Workflow

### Adding New Certificate
1. Login to admin panel
2. Go to "Certificates" tab
3. Click "Add Certificate"
4. Fill in details and save
5. Certificate appears on website immediately

### Managing Education
1. Access "Education" tab in admin
2. Add/edit your educational background
3. Set current status for ongoing studies
4. Include achievements and descriptions

### Updating Experience
1. Use "Experience" tab
2. Add work history with details
3. Include technologies and responsibilities
4. Mark current positions

## 🚨 Troubleshooting

### Connection Issues
- Check environment variables are correct
- Verify Supabase project is active
- Ensure API keys have proper permissions

### Data Not Showing
- Check browser console for errors
- Verify database tables exist
- Confirm RLS policies are set up

### Admin Panel Access
- Ensure you're logged in as admin
- Check network connectivity
- Verify Supabase service status

## 🎯 Next Steps

1. **Set up your Supabase project**
2. **Run the SQL schema**
3. **Configure environment variables**
4. **Test the admin panel**
5. **Add your real data**

Your portfolio now has a professional database backend with full admin control! 🚀
