import { useEffect, useMemo, useRef, useState } from 'react';
import '../../App.css'
import './PixelsPage.css';
import { LogoEntry } from '../../interfaces';
import { addLogo, getLogos } from '../../Store/LogosSlices';
import { useAppDispatch } from '../../Store/store';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { isItValidCell, splitImageIntoPixels } from '../../utils/ImageProcessing/splitImageIntoPixels';
import { createFormData } from '../../utils/handelFormData';

const PixelsPage = () => {
  const [selectedCells, setSelectedCells] = useState<HTMLDivElement[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [Logos, setLogos] = useState<LogoEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertType, setAlertType] = useState("alert-danger");
  const [urlPay, setUrlPay] = useState("");
  const totalCells = 10000;
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "يجب أن يتكون اسم المستخدم من 3 أحرف على الأقل")
      .required("اسم المستخدم مطلوب"),
    email: Yup.string()
      .email("البريد الإلكتروني غير صالح")
      .required("البريد الإلكتروني مطلوب"),
    title: Yup.string().required("العنوان مطلوب"),
    description: Yup.string().required("الوصف مطلوب"),
    rows: Yup.number()
      .min(1, "يجب أن تكون الصفوف رقمًا بين 1 و 10")
      .max(10, "يجب أن تكون الصفوف رقمًا بين 1 و 10")
      .required("الصفوف مطلوبة"),
    cols: Yup.number()
      .min(1, "يجب أن تكون الأعمدة رقمًا بين 1 و 10")
      .max(10, "يجب أن تكون الأعمدة رقمًا بين 1 و 10")
      .required("الأعمدة مطلوبة"),
    logoLink: Yup.string().required("رابط الشعار مطلوب"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      title: "",
      description: "",
      rows: "",
      cols: "",
      logoLink: "",
      image: null
    },
    validationSchema,
    onSubmit: (val) => {
      console.log(val);
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const navigateToPay = () => {
    console.log(urlPay)
    if (urlPay) window.location.href = urlPay;
  };

  const fetchData = async () => {
    const { logos } = await dispatch(getLogos()).unwrap();
    setLogos(logos)
    renderTheGrid();
  };

  const renderTheGrid = () => {
    Logos?.forEach((entry: LogoEntry) => {
      entry?.pixels?.forEach((cell) => {
        const cellElement = document.querySelector(
          `[data-id="${cell.pixelNumber}"]`
        ) as HTMLDivElement;
        if (cellElement) {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();
          img.src = cell.smallImage;
          img.onload = () => ctx?.drawImage(img, 0, 0);
          cellElement.innerHTML = "";
          cellElement.appendChild(canvas);
          cellElement.style.backgroundColor = "transparent";
          cellElement.title = entry.title;
          cellElement.onclick = () => window.open(entry.logoLink, "_blank");
        }
      });
    });
  };
  useMemo(()=>{
    renderTheGrid();
},[Logos]);

const toggleCellSelection = (cell: HTMLDivElement) => {
  //* check if the cell is in any logo pixels
  const cellId = parseInt(cell.getAttribute("data-id") || "0", 10);
  const logoPixels = Logos?.map((entry: LogoEntry) => entry.pixels).flat();
  const isCellInLogo = logoPixels?.some((pixel) => pixel.pixelNumber === cellId);
  if (!isCellInLogo) {
      setSelectedCells((prev) => {
          const isSelected = prev.includes(cell);
          if (isSelected) {
              cell.style.backgroundColor = "#ccc";
              return prev.filter((c) => c !== cell);
          } else {
              cell.style.backgroundColor = "#999";
              return [...prev, cell];
          }
      });
  }
};

  const sortCells = () => {
    selectedCells.sort((a, b) => {
      const aId = parseInt(a.getAttribute("data-id") || "0", 10);
      const bId = parseInt(b.getAttribute("data-id") || "0", 10);
      return aId - bId;
    });
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || selectedCells.length === 0) return;
    formik.setFieldValue("image", event.target.files?.[0]);
  };

  const handleFileChange = async () => {
    setAlertType('alert-danger');
    if (!isItValidCell(selectedCells, formik, setErrorMessage).isValid) return;
    sortCells();
    if (!formik.values.image) return;
    const image = new Image();
        image.src = URL.createObjectURL(formik.values.image);
        const cells = await splitImageIntoPixels(image, formik.values.cols, formik.values.rows, selectedCells);
        const apiData = createFormData(cells, formik.values);
        console.log(apiData);
        handleSubmit(apiData);
        setSelectedCells([]);
        fetchData();

  };

  const resetForm= ()=>{
        formik.values.username = "";
        formik.values.email = "";
        formik.values.title = "";
        formik.values.description = "";
        formik.values.rows = "";
        formik.values.cols = "";
        formik.values.logoLink = "";
        formik.values.image = null;
}

  const handleSubmit = async (apiData: FormData) => {
    const {payload} = await dispatch(addLogo({apiData})) as { payload: { success: boolean,paymentLink:string,data:{ message:string} } };
            console.log(payload.success);
            if(payload.success){
                setAlertType('alert-success');
                setErrorMessage("تم إضافة الشعار بنجاح الرجاء التوجه للشراء للتاكيد");
                setSelectedCells([]);
                resetForm();
                if (payload.paymentLink) {
                  setUrlPay(payload.paymentLink);
                }
                fetchData();
            } else {
                setErrorMessage(payload.data.message);
                setAlertType('alert-danger');
            }
            fetchData();
          };

  return (
    <div>
      <form className="form-container rtlDirection" >
        <label className="form-label text-warning fw-bold mt-1">
          قم بتحديد البكسلات التي تود شرائها واكمل البيانات لاكمال عمليه الشراء<br/>
          <span className="text-danger">
        (  يحتوي كل مربع على ١٠ بكسلات ، تكلفة المربع ٢٠ ريال لكل بكسل ٢ ريال فقط )</span>
        </label>
        <div className="row my-3">
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

        <div className="row">
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
        <div className="row my-3">
          <div className="col-md-6">
            <input
              type="number"
              name="rows"
              className="form-control"
              placeholder="الصفوف"
              required
              value={formik.values.rows}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {(formik.touched.rows && formik.errors.rows) ?
              <div className='alert alert-danger m-0 p-0 mt-2'>
                <p className='m-0'>{formik.errors.rows}</p>
              </div>
              : ""}

          </div>
          <div className="col-md-6">
            <input
              type="number"
              name="cols"
              className="form-control"
              placeholder="الاعمدة"
              required
              value={formik.values.cols}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {(formik.touched.cols && formik.errors.cols) ?
              <div className='alert alert-danger m-0 p-0 mt-2'>
                <p className='m-0'>{formik.errors.cols}</p>
              </div>
              : ""}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              name="logoLink"
              className="form-control"
              placeholder=" رابط الشعار"
              value={formik.values.logoLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {(formik.touched.logoLink && formik.errors.logoLink) ?
              <div className='alert alert-danger m-0 p-0 mt-2'>
                <p className='m-0'>{formik.errors.logoLink}</p>
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
        <button disabled={!(formik.isValid && formik.dirty)} type='button' onClick={handleFileChange} className='btn btn-success w-25 p-0 '>ارسال</button>
        <button className='btn btn-primary w-25 p-0' type='button' onClick={() => navigateToPay()} disabled={urlPay == ""}>شرائها</button>
      </div>

      {errorMessage ? (
        <div className={`alert ${alertType} mt-2`}>{errorMessage}</div>
      ) : (
        ""
      )}
      <div className="canvas-container">
        {Array.from({ length: totalCells }, (_, i) => (
          <div
            key={i}
            className="cell"
            data-id={i}
            onClick={(e) => toggleCellSelection(e.currentTarget)}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default PixelsPage
