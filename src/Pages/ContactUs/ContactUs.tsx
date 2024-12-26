import { useEffect } from "react";
import { getLogos } from "../../Store/LogosSlices";
import { useAppDispatch } from "../../Store/store";
import '../../App.css'
const ContactUs = () => {
  const goToWhatsApp = () => {
    window.open(`https://wa.me/966500000000`, "_blank");
  };
  const goToTwitter = () => {
    window.open(`https://x.com/onemillion_ar?s=11&t=GPLIYUu1K3J0AJE0KESWHw`, "_blank");
  };
  const goToTikTok = () => {
    window.open(`https://www.tiktok.com/@onemillionpixels.arabic?is_from_webapp=1&sender_device=pc`, "_blank");
  }
  const dispatch = useAppDispatch();
  useEffect(() => {
    fetchData();
    
  }, []);
  const fetchData = async () => {
    await dispatch(getLogos()).unwrap();
  };
  return (
    <div className="bg-light" style={{ direction: "rtl" }}>
      <div className="container py-5">
          <div className="row align-items-center mb-5">
          <div className="col-md-6 text-center text-md-end" >
              <h2 className="textMainColor">تواصل معنا</h2>
              <p className="text-dark">
              نحن هنا لمساعدتك والإجابة على جميع استفساراتك , اذا كان لديك أي أسئلة , اقتراحات او تحتاج الى دعم , لا تتردد في التواصل معنا من خلال الطرق التالية
              </p>
            </div>
            <div className="col-md-6">
              <img
                src="https://via.placeholder.com/500x300"
                alt="Our mission"
                className="img-fluid rounded shadow"
              />
            </div>
            
          </div>
          <div className="text-center mb-5">
            <h2 className="textMainColor">معلومات التواصل</h2>
            <p className="text-dark">
            <strong>البريد الالكتروني:</strong>
            <br/>
            <a href="mailto:Onemillion.pixels.inarabic@gmail.com">Onemillion.pixels.inarabic@gmail.com</a>
            <br/>
            <strong>الواتساب:</strong>
            <br/>
            <a href='' onClick={goToWhatsApp}>+966500000000</a>
            </p>
          </div>

          <div className="text-center mb-5">
            <h2 className="textMainColor">مواقعنا على التواصل الاجتماعي</h2>
            <p className="text-dark">
            <strong>تويتر:</strong>
            <br/>
            <a href='' onClick={goToTwitter}>onemillion_ar</a>
            <br/>
            <strong>تيك توك:</strong>
            <br/>
            <a href='' onClick={goToTikTok}>onemillionpixels</a>
            </p>
          </div>
          </div>
    </div>
  )
}

export default ContactUs
