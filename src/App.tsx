import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PixelsPage from './Pages/PixelsPage/PixelsPage'
import ShowPixels from './Pages/PixelsPage/ShowPixels'
import './App.css'
import Layout from './Components/Layout/Layout'
import { Provider } from 'react-redux'
import { Config } from './Store/store'
import ContactUs from './Pages/ContactUs/ContactUs'
import AboutUs from './Pages/AboutUs/AboutUs'
import Login from './Pages/Login/Login'
import ManageLogosWithoutPaying from './Pages/Admin/manageLogosWithoutPaying/manageLogosWithoutPaying'
import PolicyPage from './Pages/Policy/PolicyPage'

const App = () => {
  const router = createBrowserRouter([
    {path:"/login", element:<Login/>},
    {path:"/", element:<Layout/>, children:[
      {path:"/buyPixel", element:<PixelsPage/>},
      {path:"/ContactUs", element:<ContactUs/>},
      {path:"/AboutUs", element:<AboutUs/>},
      {path: "policyPage", element: <PolicyPage />},
      {path:"/", element:<ShowPixels/>},
      {path:"/ManageLogosWithoutPaying", element:<ManageLogosWithoutPaying/>},
    ],},
    
  ])
  return (
    <div className=''>
      <Provider store={Config}>
      <RouterProvider router={router}/>
      </Provider>
    </div>
  )
}

export default App
