import { useLocation, useNavigate } from "react-router-dom"
import '../../App.css'
import { useSelector } from "react-redux";
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path:string) => location.pathname === path;
  const {numberOfPixelsUsed} = useSelector((state: { LogoData: { numberOfPixelsUsed: number } }) => state.LogoData)

  return (
    <nav className="navbar p-0 pt-2 bg-secondary" style={{ direction: 'rtl' }}>
      <div className='col-md-3'>
        <h6 className="border-bottom border-1 border-warning text-warning fw-bold">مليون بكسل باللغة العربية</h6>
      </div>
      <div className='col-md-7 d-flex justify-content-around' style={{ fontSize: '12px' }}>
        <p className="text-white"><span className='dot'></span> 1,000,000 بكسل</p>
        <p className="text-white"><span className='dot'></span> 1$ لكل بكسل</p>
        <p className="text-white"><span className='dot'></span> تملك قطعة من تاريخ الإنترنت! </p>
        <div className='border rounded-3 col-md-2  border-warning' >
          <p className="text-white m-0 d-flex px-1 justify-content-between">تم بيع : <span>{numberOfPixelsUsed}</span></p>
          <p className="text-white m-0 d-flex px-1 justify-content-between"> الباقي : <span>{1000000- numberOfPixelsUsed}</span></p>

        </div>
      </div>
      <div className='w-100 bg-warning mt-2'>
        <button className={`btn btn-sm me-2 ${
            isActive("/") ? "primary" : ""
          }`} onClick={() => navigate('/')} type="button"><span>الصفحة الرئيسية</span></button>
        <span>|</span>
        {/* <button className="btn btn-sm " onClick={()=>navigate('/addPixels')} type="button">Add Pixels</button> */}
        <button className={`btn btn-sm ${
            isActive("/buyPixel") ? "primary" : ""
          }`} onClick={() => navigate('/buyPixel')} type="button"><span>اشتري بيكسل</span></button><span>|</span>
        <button className={`btn btn-sm ${
            isActive("/AboutUs") ? "primary" : ""
          }`} onClick={() => navigate('/AboutUs')} type="button"><span>من نحن</span></button><span>|</span>
        <button className={`btn btn-sm ${
            isActive("/ContactUs") ? "primary" : ""
          }`} onClick={() => navigate('/ContactUs')} type="button"><span>تواصل معنا</span></button>
      </div>
    </nav>

  )
}

export default Navbar
