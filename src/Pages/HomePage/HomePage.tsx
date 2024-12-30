import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../Store/store';
import { setLoading } from '../../Store/globalSlice';
import { getLogos } from '../../Store/LogosSlices';

const HomePage: React.FC = () => {
  const [svgContent, setSvgContent] = useState<string | null>(null); // To hold the SVG content as a string
  const dispatch = useAppDispatch();

  // This function will handle the SVG content and update the image paths
  const updateImagePaths = (svg: string) => {
    const imagePathPattern = /href="\/uploads\/([^"]+)"/g;
    const updatedSvg = svg.replace(imagePathPattern, (match, p1) => {
      return `href="https://your-server-domain.com/uploads/${p1}"`; // Update the path to the correct server URL
    });
    return updatedSvg;
  };

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(getLogos()).unwrap();

    fetch('http://localhost:3000/pixel/generatePixelsImage', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // For ngrok tunnel if needed
      },
    })
      .then(response => response.text())
      .then(data => {
        const updatedSvg = updateImagePaths(data); // Update image paths
        setSvgContent(updatedSvg); // Set the updated SVG content
      })
      .catch((error) => {
        console.error('Error fetching SVG:', error);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  return (
    <div className="w-100 border border-black">
      {svgContent ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          width="100%"
          height="100%"
          dangerouslySetInnerHTML={{ __html: svgContent }} // Set the SVG content
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HomePage;
