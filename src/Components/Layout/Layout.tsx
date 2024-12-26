import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import '../../App.css'
const Layout = () => {
  return (
    <div className='m-auto width1002'>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Layout
