import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

const ContactUs = () => {
    const [loading, setLoading] = useState(false);
    const initialValues = {
        name: '',
        email: '',
        message: '',
      };
    
      const validationSchema = Yup.object({
        name: Yup.string()
          .min(3, 'يجب أن يتكون الاسم من 3 أحرف على الأقل')
          .required('الاسم مطلوب'),
        email: Yup.string()
          .email('عنوان البريد الإلكتروني غير صالح')
          .required('البريد الإلكتروني مطلوب'),
        message: Yup.string()
          .min(10, 'يجب أن تكون الرسالة 10 أحرف على الأقل')
          .required('الرسالة مطلوبة'),
      });
      const contactUsForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit:contactUsSubmit
      })
      async function contactUsSubmit(val: typeof initialValues){
        console.log(val);
        setLoading(true);
      };
    
      return (
        <div className="container mt-5 text-end" style={{direction:'rtl'}}>
          <h2 className="text-center mb-4 text-warning">تواصل معنا </h2>
          <form onSubmit={contactUsForm.handleSubmit} className='row'>
          <div className='my-2 col-md-6'>
        <label htmlFor="name">الاسم بالكامل :</label>
        <input onChange={contactUsForm.handleChange} onKeyUp={contactUsForm.handleBlur} type="text" name="name" id="name" className='form-control my-2' />
        {(contactUsForm.touched.name&& contactUsForm.errors.name)?
        <div className='alert  px-2 alert-danger'>
        <p className='p-0 m-0'>{contactUsForm.errors.name}</p>
        </div>
        :""}
      </div>

      <div className='my-2 col-md-6'>
        <label htmlFor="email">البريد الإلكتروني :</label>
        <input onChange={contactUsForm.handleChange} onKeyUp={contactUsForm.handleBlur} type="email" name="email" id="email" className='form-control my-2' />
        {(contactUsForm.touched.email&& contactUsForm.errors.email)?
        <div className='alert  px-2 alert-danger'>
        <p className='p-0 m-0'>{contactUsForm.errors.email}</p>
        </div>
        :""}
      </div>

      <div className='my-2 col-md-12'>
        <label htmlFor="message"> الرسالة :</label>
        <textarea onChange={contactUsForm.handleChange} onKeyUp={contactUsForm.handleBlur} name="message" id="message" className='form-control my-2' />
        {(contactUsForm.touched.message&& contactUsForm.errors.message)?
        <div className='alert px-2 alert-danger'>
        <p className='p-0 m-0'>{contactUsForm.errors.message}</p>
        </div>
        :""}
      </div>



      <div className='d-flex  pt-5'>
      {loading?
  <button type='button' title='Loading' className='btn btn-warning d-block  ms-auto w-100  '>يتم الارسال<i className='fa-solid me-1 fa-spinner fa-spin'></i> </button>
  : <button disabled={!(contactUsForm.isValid && contactUsForm.dirty)} type='submit' className='btn btn-warning d-block  ms-auto w-100 '>ارسال</button>
}
     </div>
      </form>

        </div>
      );
    };    

export default ContactUs
