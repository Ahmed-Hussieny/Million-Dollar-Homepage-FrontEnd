import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../Store/store';
import '../../App.css';
import './PixelsPage.css';
import { LogoEntry } from '../../interfaces';
import { changePixelNumber, getLogos } from '../../Store/LogosSlices';
import { setLoading } from '../../Store/globalSlice';

const ShowPixels = () => {
  const totalCells = 10000;
  const dispatch = useAppDispatch();
  const [gridImage, setGridImage] = useState<string | null>(null); // State to hold the generated image URL
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    dispatch(setLoading(true));
    
    const { logos } = await dispatch(getLogos()).unwrap();
    
    let pixelsLoaded = 0;  // Counter to track the number of loaded pixels

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
          img.onload = () => {
            ctx?.drawImage(img, 0, 0);
            cellElement.innerHTML = "";
            cellElement.appendChild(canvas);
            cellElement.style.backgroundColor = "transparent";
            cellElement.title = entry.title;
            cellElement.onclick = () => window.open(entry.logoLink, "_blank");

            pixelsLoaded++;
            // Update the number of pixels after all are loaded
            // setNumberOfPixels(pixelsLoaded);
            dispatch(changePixelNumber(pixelsLoaded * 10));
          };
        }
      });
    });

    dispatch(setLoading(false));
  };

  // Function to generate the image from the grid
  const generateImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const cellSize = 10; // Size of each grid cell
    const gridSize = 100; // 100x100 grid

    canvas.width = cellSize * gridSize; // Set canvas width based on grid size
    canvas.height = cellSize * gridSize; // Set canvas height based on grid size

    // Loop through each cell and draw its content (canvas) onto the off-screen canvas
    for (let i = 0; i < totalCells; i++) {
      const cellElement = document.querySelector(`[data-id="${i}"]`) as HTMLDivElement;
      if (cellElement && cellElement.firstChild) {
        const smallCanvas = cellElement.firstChild as HTMLCanvasElement;
        ctx.drawImage(smallCanvas, (i % gridSize) * cellSize, Math.floor(i / gridSize) * cellSize);
      }
    }

    // Convert the off-screen canvas to a data URL (base64 image string)
    const imageUrl = canvas.toDataURL("image/png");
    setGridImage(imageUrl); // Set the image URL state
  };

  return (
    <div className="canvas-container m-auto">
      <div className='d-none'>
      {Array.from({ length: totalCells }, (_, i) => (
        <div
          key={i}
          className="cell"
          data-id={i}
          title={`Cell ID: ${i}`}
        ></div>
      ))}
      </div>
      <div>
      <button onClick={generateImage} className='btn btn-info'>Generate Image</button>
      </div>
      <div>
      {gridImage && (
        <div>
          <img src={gridImage} alt="Generated Grid" />
        </div>
      )}
      </div>
    </div>
  );
};

export default ShowPixels;
