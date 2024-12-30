import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../Store/store';
import { setLoading } from '../../Store/globalSlice';
// import { getLogos } from '../../Store/LogosSlices';
import axios from 'axios';

const HomePage: React.FC = () => {
  const [svgContent, setSvgContent] = useState<string | null>(null);  // To hold the SVG content as a string
  const dispatch = useAppDispatch();
  const fetchData = async () => {
    const data = await axios.get('https://2d15-102-46-146-22.ngrok-free.app/pixel/generatePixelsImage', {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "true",
      },
    })
    const blob = new Blob([data.data], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const svg = new DOMParser().parseFromString(await (await fetch(url)).text(), 'image/svg+xml');
    setSvgContent(svg.documentElement.outerHTML);
  };
  useEffect(() => {
    fetchData();
    dispatch(setLoading(false));
  }, []);

  return (
    <div className='w-100 border border-black'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 1000 1000'
        width='100%'
        height='100%'
        dangerouslySetInnerHTML={{ __html: svgContent! }}  // Set the SVG content
        />
    </div>
  );
};

export default HomePage;
