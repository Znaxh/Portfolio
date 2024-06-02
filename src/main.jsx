import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './routes/Home'
import About from './routes/About'
import Contact from './routes/Contact'
import Projects from './routes/Projects'

const router = createBrowserRouter([
  {
    path: '/',
    element : <App />,
    children : [
      {
        path : "",
        element: <Home />
      },{
        path : 'about',
        element: <About />
      },{
        path : 'contact',
        element : <Contact />
      },{
        path : 'projects',
        element : <Projects />
      }
    ] 
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
