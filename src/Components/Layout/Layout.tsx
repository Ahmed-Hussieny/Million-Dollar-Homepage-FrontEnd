import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import '../../App.css'
import { useSelector } from 'react-redux'
const Layout = () => {
  const { loading } = useSelector((state: { globalData: { loading: boolean } }) => state.globalData)
  return (
    <>
      {loading && <div className='loaderContainer position-absolute w-100 h-100 z-3'>
        <span className="loader"></span>
      </div>
      }
      <div className='m-auto width1002 z-0'>
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  )
}

export default Layout
