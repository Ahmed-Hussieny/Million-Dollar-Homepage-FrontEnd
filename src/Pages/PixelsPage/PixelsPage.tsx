import { useEffect, useRef, useState } from 'react';
import './PixelsPage.css';
import { LogoEntry, SelectedCell } from '../../interfaces';
import { getLogos } from '../../Store/LogosSlices';
import { useAppDispatch } from '../../Store/store';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const PixelsPage = () => {
  const [selectedCells, setSelectedCells] = useState<HTMLDivElement[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [logos, setLogos] = useState<LogoEntry[]>([])
  const [errorMessage, setErrorMessage] = useState("");
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
    logos?.forEach((entry: LogoEntry) => {
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

  const toggleCellSelection = (cell: HTMLDivElement) => {
    //* check if the cell is in any logo pixels
    const cellId = parseInt(cell.getAttribute("data-id") || "0", 10);
    const logoPixels = logos?.map((entry: LogoEntry) => entry.pixels).flat();
    const isCellInLogo = logoPixels.some((pixel) => pixel.pixelNumber === cellId);
    if (isCellInLogo) {
      setErrorMessage("لا يمكنك تحديد خلية موجودة في شعار آخر");
      setTimeout(() => setErrorMessage(""), 10000);
      return;
    }
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
  };

  const sortCells = () => {
    selectedCells.sort((a, b) => {
      const aId = parseInt(a.getAttribute("data-id") || "0", 10);
      const bId = parseInt(b.getAttribute("data-id") || "0", 10);
      return aId - bId;
    });
  };

  const splitImageIntoPixels = (image: HTMLImageElement) => {
    image.onload = () => {
      const cols = parseInt(formik.values.cols, 10);
      const rows = parseInt(formik.values.rows, 10);

      if (isNaN(cols) || cols <= 0 || isNaN(rows) || rows <= 0) {
        setErrorMessage("عدد الصفوف والأعمدة يجب أن يكون رقمًا صحيحًا أكبر من صفر");
        setTimeout(() => setErrorMessage(""), 10000);
        return;
      }

      const imageWidth = image.width;
      const imageHeight = image.height;
      const cellWidth = 10;
      const cellHeight = 10;

      const partWidth = Math.floor(imageWidth / cols);
      const partHeight = Math.floor(imageHeight / rows);

      const cellData: SelectedCell[] = [];

      selectedCells.forEach((cell, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        const canvas = document.createElement("canvas");
        canvas.width = cellWidth;
        canvas.height = cellHeight;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(
            image,
            col * partWidth,
            row * partHeight,
            partWidth,
            partHeight,
            0,
            0,
            cellWidth,
            cellHeight
          );

          cell.innerHTML = "";
          cell.appendChild(canvas);
          cell.style.backgroundColor = "transparent";
          cellData.push({
            cellId: parseInt(cell.dataset.id || "0", 10),
            canvasData: canvas.toDataURL(),
          });
        }
      });
      const apiData = createFormData(cellData);
      console.log(formik.values);
      handleSubmit(apiData);
      setSelectedCells([]);
    };
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || selectedCells.length === 0) return;
    formik.setFieldValue("image", event.target.files?.[0]);
  };

  const handleFileChange = () => {
    if (selectedCells.length == 0) {
      setErrorMessage("يجب تحديد عدد الخلايا المطلوبة علي المصفوفة");
      setTimeout(() => setErrorMessage(""), 10000);
      return;
    } else if (parseInt(formik.values.rows) == 0 || parseInt(formik.values.cols) == 0) {
      setErrorMessage("يجب تحديد عدد الصفوف والأعمدة");
      setTimeout(() => setErrorMessage(""), 10000);
      return;
    } else if (selectedCells.length != (parseInt(formik.values.rows) * parseInt(formik.values.cols))) {
      setErrorMessage("عدد الخلايا المحددة لا يتطابق مع عدد الصفوف والأعمدة المحددة");
      setTimeout(() => setErrorMessage(""), 10000);
      return;
    }

    sortCells();
    if (!formik.values.image) return;
    const image = new Image();
    image.src = URL.createObjectURL(formik.values.image);
    // setImg(image);
    splitImageIntoPixels(image);

  };

  const createFormData = (cellData: SelectedCell[]) => {
    const apiData = new FormData();
    apiData.append("username", formik.values.username);
    apiData.append("email", formik.values.email);
    apiData.append("title", formik.values.title);
    apiData.append("description", formik.values.description);
    apiData.append("rows", formik.values.rows.toString());
    apiData.append("cols", formik.values.cols.toString());
    apiData.append("logoLink", formik.values.logoLink);
    if (formik.values.image) {
      apiData.append("image", formik.values.image);
    }

    cellData.forEach((item, index) => {
      apiData.append(`selectedCells[${index}][cellId]`, item.cellId.toString());
      apiData.append(`selectedCells[${index}][canvasData]`, item.canvasData);
    });
    return apiData;
  };

  const handleSubmit = async (apiData: FormData) => {
    try {
      const response = await axios.post("http://localhost:3000/logo/addLogo", apiData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      console.log(data)
      if (data.paymentLink) {
        setUrlPay(data.paymentLink);
      }

      console.log(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
      setTimeout(() => setErrorMessage(""), 10000);
    }
  };

  return (
    <div>
      <form className="form-container" style={{ direction: 'rtl' }}>
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
        <div className="alert alert-danger mt-2">{errorMessage}</div>
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
