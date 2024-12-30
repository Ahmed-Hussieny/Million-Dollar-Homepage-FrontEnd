import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../Store/store';
import { setLoading } from '../../Store/globalSlice';
import { getLogos } from '../../Store/LogosSlices';

const HomePage: React.FC = () => {
  const [svgContent, setSvgContent] = useState<string | null>(null); // Holds the SVG content as a string
  const [isImagesLoaded, setIsImagesLoaded] = useState<boolean>(false); // Tracks when all images are loaded
  const dispatch = useAppDispatch();

  const handleImagesLoad = (svgString: string) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml'); // Parse the SVG string into a DOM
    const images = svgDoc.querySelectorAll('image'); // Find all <image> elements in the SVG

    if (images.length === 0) {
      setIsImagesLoaded(true); // No images to load, set as loaded
      return;
    }

    let loadedImagesCount = 0;

    images.forEach((image) => {
      const img = new Image();
      img.src = image.getAttribute('href') || image.getAttribute('xlink:href') || ''; // Get the image source
      img.onload = () => {
        loadedImagesCount++;
        if (loadedImagesCount === images.length) {
          setIsImagesLoaded(true); // All images are loaded
        }
      };
      img.onerror = () => {
        loadedImagesCount++;
        if (loadedImagesCount === images.length) {
          setIsImagesLoaded(true); // All images are loaded (even if some failed)
        }
      };
    });

    setSvgContent(svgString); // Set the SVG content even while images are loading
  };

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(getLogos()).unwrap();

    fetch('https://2d15-102-46-146-22.ngrok-free.app/pixel/generatePixelsImage', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    })
      .then((response) => response.text())
      .then((data) => {
        handleImagesLoad(data); // Process and wait for images to load
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
      {svgContent && isImagesLoaded ? (
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
