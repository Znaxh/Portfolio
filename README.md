# Anurag Pratap Singh - Portfolio Website

A modern, responsive portfolio website built with React, Vite, and TailwindCSS. Features dark mode support, GitHub API integration, admin panel, and interactive resume.

## 🚀 Features

- **Modern Tech Stack**: React + Vite + TailwindCSS
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Optimized for all devices
- **GitHub Integration**: Automatically fetches and displays repositories
- **Admin Panel**: Manage featured projects with Firebase authentication
- **Interactive Resume**: Filterable resume with download functionality
- **Performance Optimized**: Code splitting, lazy loading, and optimized bundle
- **SEO Ready**: Meta tags, Open Graph, and structured data
- **Smooth Animations**: Framer Motion animations throughout

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Authentication**: Firebase (for admin panel)
- **Deployment**: Vercel/Netlify ready

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Znaxh/portfolio-website.git
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔧 Configuration

### GitHub Integration
Update the GitHub username in `src/services/githubService.js`:
```javascript
const GITHUB_USERNAME = 'your-github-username'
```

### Personal Information
Update your personal information in the following files:
- `src/components/sections/Hero.jsx`
- `src/components/sections/About.jsx`
- `src/components/sections/Contact.jsx`
- `src/pages/Resume.jsx`

### Firebase Setup (Optional)
1. Create a Firebase project
2. Update `src/services/firebase.js` with your Firebase config
3. Enable Authentication in Firebase console

## 🚀 Deployment

### Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with the included `vercel.json` configuration

### Netlify
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Deploy automatically with the included `netlify.toml` configuration

### Manual Build
```bash
npm run build
```

## 📱 Sections

- **Hero**: Introduction with name, title, and call-to-action buttons
- **About**: Personal information and background
- **Skills**: Technical skills with interactive progress bars
- **Projects**: GitHub repositories with filtering and search
- **Achievements**: Awards, publications, and recognitions
- **Deployments**: Live project showcases
- **Resume**: Interactive, filterable resume page
- **Contact**: Contact form and social links

## 🔐 Admin Panel

Access the admin panel at `/admin/login` with demo credentials:
- Email: `admin@portfolio.com`
- Password: `admin123`

Features:
- View repository statistics
- Manage featured projects
- Real-time GitHub data sync

## 🎨 Customization

### Colors
Update the color scheme in `tailwind.config.js` or use TailwindCSS classes throughout the components.

### Content
All content is easily customizable through the component files. Update text, images, and data in the respective section components.

### Animations
Modify or add animations using Framer Motion in the component files.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Znaxh/portfolio-website/issues).

## 📞 Contact

Anurag Pratap Singh - [znaxxh@gmail.com](mailto:znaxxh@gmail.com)

Project Link: [https://github.com/Znaxh/portfolio-website](https://github.com/Znaxh/portfolio-website)
# Portfolio-new
