import { Outlet } from "react-router-dom"
import Footer from "./Pages/Footer"
import Navbar from "./Pages/Navbar"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
export default App
