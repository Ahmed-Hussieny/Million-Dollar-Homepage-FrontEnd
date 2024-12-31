import { useRef, useState } from "react"
import { useAppDispatch } from "../../Store/store";
import { setLoading, setToast } from "../../Store/globalSlice";
import * as Yup from 'yup'
import { useFormik } from "formik";
import axios from "axios";
import { updateLogo } from "../../Store/LogosSlices";
import { Pixel } from "../../interfaces";
import { useNavigate } from "react-router-dom";
export default function UpdatePixels() {
    const dispatch = useAppDispatch();
    dispatch(setLoading(false));
    const [pixelUrl, setPixelUrl] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [pixel, setPixel] = useState<Pixel>();
    const submitPixelUrl = async () => {
        if (!pixelUrl) return;
        const response = await axios.get(
            `http://localhost:3000/pixel/getImageByUrl?url=${pixelUrl}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response.data.pixel);
        setPixel(response.data.pixel);
        if(!pixel) return;
        formik.values.username = pixel.username;
        formik.values.email = pixel.email;
        formik.values.title = pixel.title;
        formik.values.description = pixel.description;
        formik.values.row = (pixel.position.x / 10).toString();
        formik.values.col = (pixel.position.y / 10).toString();
        formik.values.url = pixel.url;
        formik.values.width = (pixel.size.width / 10).toString();;
        formik.values.height = (pixel.size.height / 10).toString();;
        // const apiData = new FormData();
        console.log(pixelUrl);
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
        width: Yup.number().min(1,"يجب أن تكون العرض رقمًا بين 1 و 100").max(100, "يجب أن تكون العرض رقمًا بين 1 و 100").required("العرض مطلوب بالبكسل"),
        height: Yup.number().min(1,"يجب أن يكون الطول رقمًا بين 1 و 100").max(100, "يجب أن يكون الطول رقمًا بين 1 و 100").required("الطول مطلوب بالبكسل"),
        url: Yup.string().required("رابط الشعار مطلوب"),
        image: Yup.mixed(),
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
            apiData.append("size", JSON.stringify({ width: parseInt(val.width) * 10, height: parseInt(val.height) * 10 }));
            if (val.image) {
                apiData.append("image", val.image);
            }
        },
    });


    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files?.[0]);
        const file = event.target.files?.[0];
        if (!file) {
            dispatch(setToast({ message: "الرجاء تحديد الوقو", type: "error" }));
        }
        formik.setFieldValue("image", event.target.files?.[0]);
    };

    const handelUpdateLogo = async () => {
        console.log(formik.values);
        const apiData = new FormData();
            apiData.append("username", formik.values.username);
            apiData.append("email", formik.values.email);
            apiData.append("title", formik.values.title);
            apiData.append("description", formik.values.description);
            apiData.append("position", JSON.stringify({ x: parseInt(formik.values.row) * 10, y: parseInt(formik.values.col) * 10 }));
            apiData.append("url", formik.values.url);
            apiData.append("type", "image");
            apiData.append("size", JSON.stringify({ width: parseInt(formik.values.width)*10, height: parseInt(formik.values.height)*10 }));
            if (formik.values.image) {
                apiData.append("image", formik.values.image);
            }
        try {
            const res = await dispatch(updateLogo({url:pixelUrl, apiData}));
            console.log(res);
            if (res.payload && (res.payload as { message: string }).message) {
                dispatch(setToast({ message: "تم تحديث الشعار بنجاح", type: "success" }));
            }
        } catch (error) {
            console.log(error);
            dispatch(setToast({ message: "حدث خطأ ما", type: "error" }));
        }
    };
    const navigate = useNavigate()
    const DeletePixel = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:3000/pixel/deletePixel?url=${pixelUrl}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data);
            dispatch(setToast({ message: "تم حذف الشعار بنجاح", type: "success" }));
            navigate(-1);
        } catch (error) {
            console.log(error);
            dispatch(setToast({ message: "حدث خطأ ما", type: "error" }));
        }
    };
    return (
        <div className="container my-5">
            <label htmlFor="pixelUrl">Pixel URL:</label>
            <input
                type="text"
                id="pixelUrl"
                className="form-control"
                value={pixelUrl}
                onChange={(e) => setPixelUrl(e.target.value)}
                placeholder="Enter pixel URL"
            />
            <button onClick={submitPixelUrl} className="btn btn-primary mt-2">Submit</button>
            <form className="container rtlDirection" >
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
            <div className="container row mt-3 justify-content-center">
                <button disabled={!(formik.isValid && formik.dirty) || pixelUrl==""} onClick={handelUpdateLogo} className="btn btn-success me-3 col-md-3 mt-2">Update</button>
                <button onClick={DeletePixel} className="btn btn-danger col-md-3 mt-2">Delete</button>
            </div>
        </div>
    )
}
