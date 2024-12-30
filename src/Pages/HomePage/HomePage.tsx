import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../Store/store';
import { setLoading } from '../../Store/globalSlice';
import axios from 'axios';

const HomePage: React.FC = () => {
  const [svgContent, setSvgContent] = useState<string | null>(null); // To hold the SVG content as a string
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    try {
      // Fetch the SVG data as an arraybuffer
      const { data } = await axios.get('https://2d15-102-46-146-22.ngrok-free.app/pixel/generatePixelsImage', {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      // Create a Blob from the data and generate an object URL
      const blob = new Blob([data], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      // Fetch the text content of the SVG
      const response = await fetch(url);
      const svgText = await response.text();

      // Parse the SVG text
      const parser = new DOMParser();
      const svgDocument = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDocument.documentElement;

      // Preload image URLs inside the SVG
      const images = svgElement.querySelectorAll('image');
      images.forEach((image) => {
        const href = image.getAttribute('xlink:href') || image.getAttribute('href');
        if (href) {
          const img = new Image();
          img.src = href;
        }
      });

      // Set the SVG content
      setSvgContent(svgElement.outerHTML);

      // Revoke the object URL after use
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error fetching or parsing SVG:', error);
    }
  };

  useEffect(() => {
    fetchData();
    dispatch(setLoading(false));
  }, []);

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
