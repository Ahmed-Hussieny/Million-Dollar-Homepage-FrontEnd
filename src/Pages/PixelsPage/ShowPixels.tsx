import { useEffect} from 'react';
import './PixelsPage.css';
type LogoPixel = {
    pixelNumber: number;
    smallImage: string;
    logoLink: string;
    title: string;
  };
  
const ShowPixels = () => {

  const totalCells = 10000; // 100x100 grid

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("http://localhost:3000/logo/getLogos")
      .then((response) => response.json())
      .then((data) => {
        data.logos?.forEach((entry: { pixels: LogoPixel[],logoLink:string }) => {
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

  return (
    <div className='cont'>
        <div >
    <h1>Million Dollar Homepage</h1>

    <div className="canvas-container">
      {Array.from({ length: totalCells }, (_, i) => (
        <div
          key={i}
          className="cell"
          data-id={i}
        ></div>
      ))}
    </div>
  </div>
    </div>
  )
}

export default ShowPixels
