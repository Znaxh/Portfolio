# Portfolio

**Personal developer portfolio with animated UI, project showcase, and Groq-powered chat.**

[![Live Site](https://img.shields.io/badge/site-znaxh.vercel.app-0ea5e9?style=flat-square)](https://znaxh.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

Modern portfolio site highlighting projects, skills, and contact links. Built for fast load, strong visual polish, and interactive sections recruiters can explore quickly.

---

## Highlights

- **Animated hero & sections** with Framer Motion and GSAP
- **Skills constellation / graph** visualizations (D3)
- **Project showcase** driven by `src/data/portfolio.json`
- **Dark mode** theme toggle
- **Ask Anurag chatbot** powered by Groq SDK
- **Pipeline / architecture visualizers** for featured work
- **Responsive layout** with custom cursor and easter eggs

---

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 19, Vite 7, React Router |
| Styling | Tailwind CSS 4 |
| Motion | Framer Motion, GSAP, React Spring |
| Data viz | D3 |
| AI chat | Groq SDK |
| Deploy | Vercel-ready (`vercel.json`) |

---

## Quick start

```bash
git clone https://github.com/Znaxh/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open http://localhost:5173

### Environment variables

Create `.env` if using the chatbot features:

```env
VITE_GROQ_API_KEY=your_groq_api_key
```

### Production build

```bash
npm run build
npm run preview
```

---

## Customize content

Most site content lives in:

- `src/data/portfolio.json` — projects, skills, links, metrics
- `src/components/sections/` — Hero, About, Projects, Contact
- `public/` — static assets

Update portfolio JSON first, then tweak section components for layout changes.

---

## Project structure

```
Portfolio/
├── src/
│   ├── components/
│   │   ├── sections/      # page sections
│   │   ├── layout/        # navbar, footer
│   │   ├── effects/       # visual effects
│   │   └── ui/            # chatbot, buttons
│   ├── data/
│   │   └── portfolio.json
│   └── hooks/
├── public/
└── vercel.json
```

---

## Live site

https://znaxh.vercel.app/

---

## Author

**Anurag Pratap Singh**

- GitHub: https://github.com/Znaxh
- LinkedIn: https://www.linkedin.com/in/pratapsinghanurag/

## License

MIT — see [LICENSE](LICENSE) if present.
