import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PixelsPage from './Pages/PixelsPage/PixelsPage'
import ShowPixels from './Pages/PixelsPage/ShowPixels'
import './App.css'
import Layout from './Components/Layout/Layout'
import { Provider } from 'react-redux'
import { Config } from './Store/store'
import ContactUs from './Pages/ContactUs/ContactUs'
import AboutUs from './Pages/AboutUs/AboutUs'

const App = () => {
  const router = createBrowserRouter([
    {path:"/", element:<Layout/>, children:[
      {path:"/buyPixel", element:<PixelsPage/>},
      {path:"/ContactUs", element:<ContactUs/>},
      {path:"/AboutUs", element:<AboutUs/>},
      {path:"/", element:<ShowPixels/>},
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
