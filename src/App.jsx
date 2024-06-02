import { Outlet } from "react-router-dom"
import Header from "./routes/Header"
import Footer from "./routes/Footer"

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
