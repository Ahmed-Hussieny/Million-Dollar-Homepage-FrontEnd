import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../Store/store";
import { setLoading, setToast } from "../../Store/globalSlice";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { addPixel, getLogos } from "../../Store/LogosSlices";
export default function AddPixel() {
    const [svgContent, setSvgContent] = useState<string | null>(null);  // To hold the SVG content as a string
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const dispatch = useAppDispatch();
    const [urlPay, setUrlPay] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        dispatch(setLoading(true));
        await dispatch(getLogos()).unwrap();
        fetch('https://2d15-102-46-146-22.ngrok-free.app/pixel/generatePixelsImage', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true",
            },
        })
            .then(response => response.text())  // Expecting the response as text
            .then(data => {
                setSvgContent(data);  // Set the SVG content to state
            })
            .catch((error) => {
                console.error('Error fetching SVG:', error);
            });
        dispatch(setLoading(false));
    };
    const validationSchema = Yup.object({
        username: Yup.string()
            .min(3, "يجب أن يتكون اسم المستخدم من 3 أحرف على الأقل")
            .required("اسم المستخدم مطلوب"),
        email: Yup.string()
            .email("البريد الإلكتروني غير صالح")
            .required("البريد الإلكتروني مطلوب"),
        title: Yup.string().required("العنوان مطلوب"),
        description: Yup.string().required("الوصف مطلوب"),
        row: Yup.number()
            .min(0, "يجب أن تكون الصفوف رقمًا بين 0 و 1000")
            .max(1000, "يجب أن تكون الصفوف رقمًا بين 0 و 1000")
            .required("الصفوف مطلوبة"),
        col: Yup.number()
            .min(0, "يجب أن تكون الأعمدة رقمًا بين 0 و 1000")
            .max(1000, "يجب أن تكون الأعمدة رقمًا بين 0  و 1000")
            .required("الأعمدة مطلوبة"),
        width: Yup.number().required("العرض مطلوب بالبكسل"),
        height: Yup.number().required("العرض مطلوب بالبكسل"),
        url: Yup.string().required("رابط الشعار مطلوب"),
        image: Yup.mixed().required("الصورة مطلوبة"),
    });
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            title: "",
            description: "",
            row: "",
            col: "",
            url: "",
            width: "",
            height: "",
            image: null
        },
        validationSchema,
        onSubmit: async (val) => {
            const apiData = new FormData();
            apiData.append("username", val.username);
            apiData.append("email", val.email);
            apiData.append("title", val.title);
            apiData.append("description", val.description);
            apiData.append("position", JSON.stringify({ x: val.row, y: val.col }));
            apiData.append("url", val.url);
            apiData.append("type", "image");
            apiData.append("size", JSON.stringify({ width: val.width, height: val.height }));
            if (val.image) {
                apiData.append("image", val.image);
            }
            const { payload } = await dispatch(addPixel({ apiData })) as { payload: { response: { data: { message: string } }, success: boolean, paymentLink: string, data: { message: string } } }
            console.log(payload);
            if (payload.success) {
                dispatch(setToast({ message: "تم إضافة الشعار بنجاح الرجاء التوجه للشراء للتاكيد", type: "success" }));
                resetForm();
                if (payload.paymentLink) {
                    setUrlPay(payload.paymentLink);
                }
            } else {
                console.log(payload.response.data.message);
                dispatch(setToast({ message: payload.response.data.message, type: "error" }));
                // setAlertType('alert-danger');
            }
        },
    });

    const navigateToPay = () => {
        if (urlPay) window.location.href = urlPay;
    };

    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files?.[0]);
        const file = event.target.files?.[0];
        if (!file) {
            dispatch(setToast({ message: "الرجاء تحديد الوقو", type: "error" }));
        }
        formik.setFieldValue("image", event.target.files?.[0]);
    };

    const resetForm = () => {
        formik.values.username = "";
        formik.values.email = "";
        formik.values.title = "";
        formik.values.description = "";
        formik.values.row = "";
        formik.values.col = "";
        formik.values.url = "";
        formik.values.image = null;
        formik.values.width = "";
        formik.values.height = "";
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
    return (
        <div>
            <form className="container rtlDirection" >
                <label className="form-label text-warning fw-bold mt-1">
                    قم بتحديد البكسلات التي تود شرائها واكمل البيانات لاكمال عمليه الشراء<br />
                    <span className="text-danger">
                        ( تكلفة البكسل ٢ ريال)</span>
                    <br />
                    <span className="text-danger"> (  لقبول طلبكم الرجاء وضع اللوقو باللغة العربية فقط )</span>
                </label>
                <div className="row gy-3 my-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            required
                            placeholder="الاسم بالكامل"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.username && formik.errors.username) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.username}</p>
                            </div>
                            : ""}
                    </div>
                    <div className="col-md-6">
                        <input
                            type="email"
                            name="email"
                            required
                            className="form-control"
                            placeholder="البريد الالكتروني"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.email && formik.errors.email) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.email}</p>
                            </div>
                            : ""}
                    </div>
                </div>

                <div className="row gy-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="title"
                            required
                            className="form-control"
                            placeholder="العنوان"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.title && formik.errors.title) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.title}</p>
                            </div>
                            : ""}
                    </div>
                    <div className="col-md-6">
                        <textarea
                            name="description"
                            className="form-control"
                            placeholder="الوصف"
                            required
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.description && formik.errors.description) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.description}</p>
                            </div>
                            : ""}
                    </div>
                </div>
                <div className="row gy-3 my-3">
                    <div className="col-md-6">
                        <input
                            type="number"
                            name="row"
                            className="form-control"
                            placeholder="الصف"
                            required
                            value={formik.values.row}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.row && formik.errors.row) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.row}</p>
                            </div>
                            : ""}

                    </div>
                    <div className="col-md-6">
                        <input
                            type="number"
                            name="col"
                            className="form-control"
                            placeholder="العمود"
                            required
                            value={formik.values.col}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.col && formik.errors.col) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.col}</p>
                            </div>
                            : ""}
                    </div>
                </div>
                <div className="row gy-3 my-3">
                    <div className="col-md-6">
                        <input type="number" name="width" className="form-control" placeholder="العرض" required value={formik.values.width} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {(formik.touched.width && formik.errors.width) ? <div className='alert alert-danger m-0 p-0 mt-2'>
                            <p className='m-0'>{formik.errors.width}</p>
                        </div> : ""}
                    </div>

                    <div className="col-md-6" >
                        <input type="number" name="height" className="form-control" placeholder="الارتفاع" required value={formik.values.height} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {(formik.touched.height && formik.errors.height) ? <div className='alert alert-danger m-0 p-0 mt-2'>
                            <p className='m-0'>{formik.errors.height}</p> </div> : ""}
                    </div>
                </div>
                <div className="row gy-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="url"
                            className="form-control"
                            placeholder=" رابط الشعار"
                            value={formik.values.url}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.touched.url && formik.errors.url) ?
                            <div className='alert alert-danger m-0 p-0 mt-2'>
                                <p className='m-0'>{formik.errors.url}</p>
                            </div>
                            : ""}
                    </div>

                    <div className="col-md-6">
                        <input
                            id="file-upload"
                            type="file"
                            ref={fileInputRef}
                            className="form-control"
                            required
                            accept="image/*"
                            onChange={handleFile}
                            title="اختر صورة"
                            placeholder="اختر صورة"
                        />
                        {(formik.touched.image && formik.errors.image) ? <div className='alert alert-danger m-0 p-0 mt-2'>
                            <p className='m-0'>{formik.errors.image}</p>
                        </div> : ""}
                    </div>
                </div>
            </form>
            <div className='d-flex justify-content-evenly px-5 mx-5 my-2'>
                <button disabled={!(formik.isValid && formik.dirty)} type='button'
                    onClick={() => formik.handleSubmit()}
                    className='btn btn-success w-25 p-0 '>ارسال</button>
                <div className="arrow-container w-50">
                    {urlPay &&
                        <span className="arrow">
                            <i className="fa-solid fa-arrow-right fs-3 textMainColor"></i>
                        </span>}
                </div>
                <button className='btn btn-primary w-25 p-0' type='button' onClick={() => navigateToPay()} disabled={urlPay == ""}>شرائها</button>
            </div>
            <div className='w-100 border border-black'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 1000 1000'
                    width='100%'
                    height='100%'
                    dangerouslySetInnerHTML={{ __html: svgContent! }}  // Set the SVG content
                />
            </div>
        </div>
    )
}
