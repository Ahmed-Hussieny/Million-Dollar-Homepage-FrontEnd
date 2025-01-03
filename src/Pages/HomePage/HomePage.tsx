import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../Store/store';
import { setLoading } from '../../Store/globalSlice';
import { getLogos } from '../../Store/LogosSlices';

const HomePage: React.FC = () => {
  const [svgContent, setSvgContent] = useState<string | null>(null); 
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(getLogos()).unwrap();
    fetch('https://2d15-102-46-146-22.ngrok-free.app/gridImage/pixels_image.svg', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then(response => response.text())
      .then(data => {
        setSvgContent(data);
      })
      .catch((error) => {
        console.error('Error fetching SVG:', error);
      });
    dispatch(setLoading(false));
  }, []);

  return (
    <div className="w-100 border border-black position-relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        width="100%"
        height="100%"
        dangerouslySetInnerHTML={{ __html: svgContent! }}
      />
    </div>
  );
};

export default HomePage;
