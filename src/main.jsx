import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './Pages/Home'
import About from './Pages/About'
import Resume from './Pages/Resume'
import Projects from './Pages/Projects'

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
        path : 'resume',
        element : <Resume />
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
