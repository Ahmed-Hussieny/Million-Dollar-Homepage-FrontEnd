import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
const Layout = () => {
  return (
    <div style={{ width:'1002px'}}>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Layout
