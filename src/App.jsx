import { Outlet } from "react-router-dom"
import Footer from "./Pages/Footer"
import Navbar from "./Pages/Navbar"

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
