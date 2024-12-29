import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import '../../App.css'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import { useEffect } from 'react'
const Layout = () => {
  const { loading, toasting } = useSelector((state: { globalData: { loading: boolean, toasting:{message: string, type: string} } }) => state.globalData)

  useEffect(() => {
    if (toasting.message) {
      toast(toasting.message, { type: toasting.type as 'info' | 'success' | 'warning' | 'error' })
    }
  }, [toasting])
  return (  
    <>
      {/* {loading && <div className='loaderContainer position-absolute w-100 h-100 z-3'>
        <span className="loader"></span>
      </div>
      } */}
      <div className='m-auto width1002 z-0'>
        <ToastContainer theme="colored" />
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  )
}

export default Layout
