# 🔐 Admin Panel Guide

## Overview
Your portfolio includes a secure admin panel that allows you to control which projects are displayed on your website. This panel is not publicly visible and requires authentication.

## 🚀 Accessing the Admin Panel

### URL
```
http://localhost:5173/admin/login
```

### Login Credentials
- **Email:** `anurag@portfolio.com`
- **Password:** `portfolio2024!`

## 📋 Features

### 1. **Dashboard Overview**
- View total repositories from your GitHub
- See featured projects count
- Monitor total stars across all projects
- Track programming languages used

### 2. **Project Management**
- **View All Repositories:** See all your GitHub repositories
- **Toggle Visibility:** Click the eye icon to show/hide projects
- **Featured Projects:** Only selected projects appear on your portfolio
- **Save Changes:** Click "Save Featured Projects" to apply changes

### 3. **Real-time Updates**
- Changes are immediately reflected on your portfolio
- Notification system confirms successful saves
- Automatic GitHub data synchronization

## 🛡️ Security Features

- **Authentication Required:** Admin panel is protected by login
- **Session Management:** Secure session handling
- **Access Control:** Only authenticated users can access the dashboard
- **Auto-logout:** Sessions expire for security

## 📱 How to Use

### Step 1: Login
1. Navigate to `/admin/login`
2. Enter your credentials
3. Click "Sign In"

### Step 2: Manage Projects
1. View your GitHub repositories in the dashboard
2. Click the eye icon (👁️) to feature/unfeature projects
3. Featured projects will show a filled eye icon
4. Unfeatured projects will show a crossed-out eye icon

### Step 3: Save Changes
1. After selecting your featured projects
2. Click "Save Featured Projects" button
3. Wait for the success notification
4. Your portfolio will now display only the selected projects

### Step 4: Logout
1. Click the logout button in the top-right corner
2. You'll be redirected to the login page

## 🔄 Project Synchronization

The admin panel automatically:
- Fetches your latest GitHub repositories
- Updates project information (stars, forks, etc.)
- Maintains your featured project selections
- Syncs data with your portfolio display

## 🎯 Best Practices

1. **Select Quality Projects:** Choose 3-6 of your best projects to feature
2. **Regular Updates:** Refresh repository data periodically
3. **Save Changes:** Always save after making selections
4. **Secure Access:** Keep your admin credentials safe
5. **Test Changes:** Check your portfolio after making updates

## 🚨 Troubleshooting

### Can't Access Admin Panel?
- Check the URL: `/admin/login`
- Verify credentials are correct
- Clear browser cache if needed

### Projects Not Updating?
- Click "Refresh Repositories" button
- Save your featured selections again
- Check browser console for errors

### Lost Admin Access?
- The credentials are: `anurag@portfolio.com` / `portfolio2024!`
- Clear localStorage and try again

## 🔧 Technical Details

- **Storage:** Featured projects are stored in localStorage
- **GitHub API:** Automatically fetches repository data
- **Real-time:** Changes reflect immediately on the portfolio
- **Responsive:** Admin panel works on all devices

## 📞 Support

If you need to modify the admin panel or add new features, the relevant files are:
- `src/pages/admin/AdminLogin.jsx`
- `src/pages/admin/AdminDashboard.jsx`
- `src/services/githubService.js`

---

**🎉 Your admin panel is now ready to use! Access it at `/admin/login` and start managing your portfolio projects.**
