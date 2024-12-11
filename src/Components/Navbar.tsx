import { useNavigate } from "react-router-dom"

const Navbar = () => {
    const navigate = useNavigate();
  return (
<nav className="navbar bg-body-tertiary">
  <form className="container-fluid justify-content-center">
    <button className="btn btn-sm btn-secondary me-2" onClick={()=>navigate('/')} type="button">Show Pixels</button>
    <button className="btn btn-sm btn-secondary" onClick={()=>navigate('/addPixels')} type="button">Add Pixels</button>
  </form>
</nav>

  )
}

export default Navbar
