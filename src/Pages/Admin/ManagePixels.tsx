import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useAppDispatch } from '../../Store/store';
import { addPixelWithoutPayment, getLogos } from '../../Store/LogosSlices';
import { useNavigate } from 'react-router-dom';
// import { createFormData } from '../../utils/handelFormData';
import { setLoading, setToast } from '../../Store/globalSlice';

const ManagePixels = () => {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null); const navigate = useNavigate()
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [tooltip, setTooltip] = useState({ x: 0, y: 0, visible: false, text: '' });

    const dispatch = useAppDispatch();
    useEffect(() => {
        fetchData();
    }, []);
    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
        if (svgRef.current) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const mouseX = event.clientX - svgRect.left; // X relative to the SVG
            const mouseY = event.clientY - svgRect.top;  // Y relative to the SVG
            const svgWidth = svgRect.width;
            const svgHeight = svgRect.height;

            // Calculate percentages
            const percentX = (mouseX / svgWidth) * 100; // Percentage X relative to the SVG
            const percentY = (mouseY / svgHeight) * 100; // Percentage Y relative to the SVG

            setTooltip({
                x: percentX, // Percentage-based position
                y: percentY,
                visible: true,
                text: `X: ${(percentX).toFixed(0)}, Y: ${(percentY).toFixed(0)}`, // Tooltip content
            });
        }
    };

    const handleMouseLeave = () => {
        setTooltip({ ...tooltip, visible: false });
    };
    const fetchData = async () => {
        dispatch(setLoading(true));
        await dispatch(getLogos()).unwrap();
        fetch('https://2d15-102-46-146-22.ngrok-free.app/gridImage/pixels_image.svg', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "ngrok-skip-browser-warning": "true",
            },
        })
            .then(response => response.text())
            .then(data => {
                setSvgContent(data);
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
            .min(0, "يجب أن تكون الصفوف رقمًا بين 0 و 100")
            .max(100, "يجب أن تكون الصفوف رقمًا بين 0 و 100")
            .required("الصفوف مطلوبة"),
        col: Yup.number()
            .min(0, "يجب أن تكون الأعمدة رقمًا بين 0 و 100")
            .max(100, "يجب أن تكون الأعمدة رقمًا بين 0  و 100")
            .required("الأعمدة مطلوبة"),
        width: Yup.number().required("العرض مطلوب بالبكسل"),
        height: Yup.number().required("الطول مطلوب بالبكسل"),
        url: Yup.string().required("رابط الشعار مطلوب"),
        image: Yup.mixed().required("الصورة مطلوبة"),
    });
    const formik = useFormik({
        initialValues: {
            _id: "",
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
            apiData.append("position", JSON.stringify({ x: parseInt(val.row) * 10, y: parseInt(val.col) * 10 }));
            apiData.append("url", val.url);
            apiData.append("type", "image");
            apiData.append("size", JSON.stringify({ width: parseInt(val.width)*10, height: parseInt(val.height)*10 }));
            if (val.image) {
                apiData.append("image", val.image);
            }
            console.log(val)
            const { payload } = await dispatch(addPixelWithoutPayment({ apiData })) as { payload: { success: boolean,message:string, response: { data: { message: string } } } };
            console.log(payload);
            if (payload.success) {
                dispatch(setToast({ message: "تم إضافة الشعار بنجاح ", type: "success" }));
                resetForm();
            } else if(payload?.message){
                dispatch(setToast({ message: payload?.message, type: "error" }));
            } else {
                console.log(payload.response.data.message);
                dispatch(setToast({ message: payload.response.data.message, type: "error" }));
            }
            fetchData();
        },
    });
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            dispatch(setToast({ message: "الرجاء تسجيل الدخول", type: "error" }));
            navigate('/login');
        }
        fetchData();
    }, []);

    const resetForm = () => {
        formik.values._id = "";
        formik.values.username = "";
        formik.values.email = "";
        formik.values.title = "";
        formik.values.description = "";
        formik.values.row = "";
        formik.values.col = "";
        formik.values.url = "";
        formik.values.image = null;
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files?.[0]);
        const file = event.target.files?.[0];
        if (!file) {
            dispatch(setToast({ message: "الرجاء تحديد الوقو", type: "error" }));
        }
        formik.setFieldValue("image", event.target.files?.[0]);
    };

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
            <div className='d-flex justify-content-evenly my-2'>
                <button disabled={!(formik.isValid && formik.dirty)} type='button' onClick={() => formik.handleSubmit()} className='btn btn-success w-25 p-0 '>اضافة</button>
                {/* delete or update button */}
                <button type='button' onClick={() => navigate('/UpdatePixels')} className='btn btn-danger w-25 p-0 '>تعديل او حذف</button>
            </div>

            <div className="w-100 border border-black" style={{ position: 'relative' }}>
                <svg
                    ref={svgRef}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1000 1000"
                    width="100%"
                    height="100%"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    dangerouslySetInnerHTML={{ __html: svgContent! }}
                />
                {tooltip.visible && (
                    <div
                        style={{
                            position: 'absolute',
                            top: `${tooltip.y - 2}%`, // Use percentage for positioning
                            left: `${tooltip.x - 4}%`,
                            transform: 'translate(-50%, -100%)', // Center above the mouse
                            background: 'rgba(0, 0, 0, 0.75)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            pointerEvents: 'none', // Prevent tooltip from interfering with mouse events
                        }}
                    >
                        {tooltip.text}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManagePixels
