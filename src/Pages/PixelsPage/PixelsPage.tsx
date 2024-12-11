import { useEffect, useRef, useState } from 'react';
import './PixelsPage.css';
type LogoPixel = {
    pixelNumber: number;
    smallImage: string;
    logoLink: string;
    title: string;
  };
  
  type SelectedCell = {
    cellId: number;
    canvasData: string;
  };
const PixelsPage = () => {
    const [selectedCells, setSelectedCells] = useState<HTMLDivElement[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rows: "",
    cols: "",
    logoLink: "",
  });

  const totalCells = 10000; // 100x100 grid

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("http://localhost:3000/logo/getLogos")
      .then((response) => response.json())
      .then((data) => {
        data.logos?.forEach((entry: { pixels: LogoPixel[] , logoLink:string}) => {
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
              cellElement.title = entry.logoLink; // Tooltip
              cellElement.onclick = () => window.open(entry.logoLink, "_blank"); // Navigate to link
            }
          });
        });
      })
      .catch((error) => console.error(error));
  };

  const toggleCellSelection = (cell: HTMLDivElement) => {
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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || selectedCells.length === 0) return;
    selectedCells.sort((a, b) => {
      const aId = parseInt(a.getAttribute("data-id") || "0", 10);
      const bId = parseInt(b.getAttribute("data-id") || "0", 10);
      return aId - bId;
    });
    const image = new Image();
    image.src = URL.createObjectURL(file);
    // setImg(image);

    image.onload = () => {
      const cols = parseInt(formData.cols, 10);
      const rows = parseInt(formData.rows, 10);

      if (isNaN(cols) || cols <= 0 || isNaN(rows) || rows <= 0) {
        alert("Invalid rows or columns.");
        return;
      }

      const imageWidth = image.width;
      const imageHeight = image.height ;
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
        canvas.height = cellHeight + 6;
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

      const apiData = new FormData();
      apiData.append("title", formData.title);
      apiData.append("description", formData.description);
      apiData.append("rows", rows.toString());
      apiData.append("cols", cols.toString());
      apiData.append("logoLink", formData.logoLink);

      cellData.forEach((item, index) => {
        apiData.append(`selectedCells[${index}][cellId]`, item.cellId.toString());
        apiData.append(`selectedCells[${index}][canvasData]`, item.canvasData);
      });

      fetch("http://localhost:3000/logo/addLogo", {
        method: "POST",
        body: apiData,
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));

      setSelectedCells([]);
    };
  };

  return (
    <div className='cot'>
        <div >
    <h1>Million Dollar Homepage</h1>
    <p>
      Click on multiple squares to select them, and upload an image to divide
      and place it across them.
    </p>

    

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

    <form className="form-container">
      <input
        type="text"
        name="title"
        className='form-control col-md-6'
        placeholder="Title"
        value={formData.title}
        onChange={handleInputChange}
      />
      <textarea
        name="description"
        className='form-control'
        placeholder="Description"
        value={formData.description}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="rows"
        className='form-control'
        placeholder="Rows"
        value={formData.rows}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="cols"
        className='form-control'
        placeholder="Columns"
        value={formData.cols}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="logoLink"
        className='form-control'
        placeholder="Logo Link"
        value={formData.logoLink}
        onChange={handleInputChange}
      />
    </form>
    <div className="upload-button">
      <label htmlFor="file-upload" className="upload-button">
        Upload Image
      </label>
      <input
        id="file-upload"
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  </div>
    </div>
  )
}

export default PixelsPage
