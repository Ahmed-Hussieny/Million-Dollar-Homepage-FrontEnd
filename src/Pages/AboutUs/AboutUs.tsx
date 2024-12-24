import '../../App.css'
const AboutUs = () => {
    return (
      <div className="about-us-page bg-light" style={{ direction: "rtl" }}>
        {/* Header Section */}
        <header className="text-center bg-warning py-4">
          <h1 className="text-dark fw-bold">من نحن</h1>
          <p className="text-dark fs-5">
            اكتشف قصة مليون بكسل باللغة العربية وكيف نسعى لجعل الإنترنت أكثر إبداعًا.
          </p>
        </header>
  
        {/* Content Section */}
        <div className="container py-5">
          <div className="row align-items-center mb-5">
          <div className="col-md-6 text-center text-md-end" >
              <h2 className="text-warning">مهمتنا</h2>
              <p className="text-dark">
                نهدف إلى تقديم تجربة فريدة من خلال مشروع مليون بكسل، مما يتيح
                للأفراد والمؤسسات أن يكونوا جزءًا من تاريخ الإنترنت. نسعى إلى
                إلهام الإبداع وتشجيع الابتكار في العالم الرقمي.
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
  
          {/* Team Section */}
          <div className="text-center mb-5">
            <h2 className="text-warning">فريقنا</h2>
            <p className="text-dark">
              يتكون فريقنا من مجموعة من المحترفين المبدعين المتحمسين لتقديم أفضل
              الخدمات.
            </p>
          </div>
          <div className="row justify-content-center">
            {/* Team Member 1 */}
            <div className="col-md-4 mb-4">
              <div className="card border-warning shadow">
                <img
                  src="https://via.placeholder.com/150"
                  className="card-img-top rounded-circle mx-auto mt-3"
                  alt="Team Member"
                  style={{ width: "100px", height: "100px" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-dark">أحمد محمد</h5>
                  <p className="card-text text-muted">مطور ويب</p>
                </div>
              </div>
            </div>
            {/* Team Member 2 */}
            <div className="col-md-4 mb-4">
              <div className="card border-warning shadow">
                <img
                  src="https://via.placeholder.com/150"
                  className="card-img-top rounded-circle mx-auto mt-3"
                  alt="Team Member"
                  style={{ width: "100px", height: "100px" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-dark">سارة علي</h5>
                  <p className="card-text text-muted">مدير المشروع</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutUs;