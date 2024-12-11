import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PixelsPage from './Pages/PixelsPage/PixelsPage'
import ShowPixels from './Pages/PixelsPage/ShowPixels'
import './App.css'
import Layout from './Components/Layout/Layout';
const App = () => {
  const router = createBrowserRouter([
    {path:"/", element:<Layout/>, children:[
      {path:"/addPixels", element:<PixelsPage/>},
      {path:"/", element:<ShowPixels/>},
    ],},
    
  ])
  return (
    <div className='App'>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
