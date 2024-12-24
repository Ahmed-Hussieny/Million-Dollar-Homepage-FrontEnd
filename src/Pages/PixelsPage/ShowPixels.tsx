import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../Store/store';
import './PixelsPage.css';
import { LogoEntry } from '../../interfaces';
import { changePixelNumber, getLogos } from '../../Store/LogosSlices';
const ShowPixels = () => {
  
  const totalCells = 10000;
  const dispatch = useAppDispatch();
  const [numberOfPixels, setNumberOfPixels] = useState(0);
  useEffect(() => {
    setNumberOfPixels(0);
    fetchData();
    //^ render number of pixels in logos
    dispatch(changePixelNumber(numberOfPixels*10));
  }, []);

  const fetchData = async () => {
    const { logos } = await dispatch(getLogos()).unwrap();
    logos?.forEach((entry: LogoEntry) => {
      entry?.pixels?.forEach((cell) => {
        // setNumberOfPixels(numberOfPixels + entry.pixels.length);
        console.log(numberOfPixels)
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
  };

  return (
    <div>
      <div>
        <div className="canvas-container">
          {Array.from({ length: totalCells }, (_, i) => (
            <div
              key={i}
              className="cell"
              data-id={i}
              title={`Cell ID: ${i}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShowPixels
