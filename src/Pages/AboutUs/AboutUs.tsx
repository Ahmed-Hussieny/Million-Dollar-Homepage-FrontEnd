import { useEffect } from 'react';
import '../../App.css'
import { getLogos } from '../../Store/LogosSlices';
import { useAppDispatch } from '../../Store/store';
const AboutUs = () => {
  const dispatch = useAppDispatch();
    useEffect(() => {
      fetchData();
      
    }, []);
    const fetchData = async () => {
      await dispatch(getLogos()).unwrap();
    };
    return (
      <div className="about-us-page bg-light d-flex" style={{ direction: "rtl" }}>
        {/* Content Section */}
        <div className="container py-5">
          <div className="row align-items-center mb-5">
          <div className="col-md-6 text-center text-md-end" >
              <h2 className="text-warning">من نحن</h2>
              <p className="text-dark">
              صفحة المليون بكسل هي فكرة مبتكرة تهدف إلى تقديم مساحة إعلانية فريدة من نوعها , تجمع بين الابداع والبساطة . نحن نمنح الافراد و الشركات فرصة ليكونوا جزءاً من مشروع رقمي يعتمد على بيع مساحات صغيرة (البكسلات) في صفحة واحدة . بحيث يمكن للجميع ترك بصمتهم و الإعلان عن خدماتهم او منتجاتهم بطريقة مميزة لا تُنسى !
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

          <div className="row align-items-center mb-5">
          
            <div className="col-md-6">
              <img
                src="https://via.placeholder.com/500x300"
                alt="Our mission"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-md-6 text-center text-md-end" >
              <h2 className="textMainColor">رسالتنا</h2>
              <p className="text-dark">
             هي بناء لوحة إعلانية رقمية تمثل تنوع المجتمع العربي وإبداعاته , من خلال توفير منصة تفاعلية تعكس الروح الابتكارية وتتيح فرصة للجميع للمشاركة والابداع .
              </p>
            </div>
          </div>
  
          {/* Team Section */}
          <div className="text-center mb-5">
            <h2 className="textMainColor">فريقنا</h2>
            <p className="text-dark">
            انضم إلينا و كن جزءاً من هذه الفكرة الفريدة اللتي تجمع بين الفن , التقنية , والتسويق في تجربة إعلانية لا مثيل لها ستبقى للأبد !
            </p>
          </div>
          <div className="row justify-content-center">
            
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutUs;