import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../../Store/store';
import { setLoading } from '../../Store/globalSlice';
import { getLogos } from '../../Store/LogosSlices';

const HomePage: React.FC = () => {
  const [svgContent, setSvgContent] = useState<string | null>(null); // To hold the SVG content as a string
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, visible: false, text: '' });

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
        setSvgContent(data); // Set the SVG content to state
      })
      .catch((error) => {
        console.error('Error fetching SVG:', error);
      });
    dispatch(setLoading(false));
  }, []);

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const mouseX = event.clientX - svgRect.left; // X relative to the SVG
      const mouseY = event.clientY - svgRect.top;  // Y relative to the SVG
      const svgWidth = svgRect.width;
      const svgHeight = svgRect.height;

      // Calculate percentages
      const percentX = (mouseX / svgWidth) * 100; // Percentage X relative to the SVG
      const percentY = (mouseY / svgHeight) * 100; // Percentage Y relative to the SVG

      setTooltip({
        x: percentX, // Percentage-based position
        y: percentY,
        visible: true,
        text: `X: ${Number(percentX.toFixed(0)) * 10}, Y: ${Number(percentY.toFixed(0)) * 10}`, // Tooltip content
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  return (
    <div className="w-100 border border-black" style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        width="100%"
        height="100%"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        dangerouslySetInnerHTML={{ __html: svgContent! }}
      />
      {tooltip.visible && (
        <div
          style={{
            position: 'absolute',
            top: `${tooltip.y + 4}%`, // Use percentage for positioning
            left: `${tooltip.x +6}%`,
            transform: 'translate(-50%, -100%)', // Center above the mouse
            background: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            pointerEvents: 'none', // Prevent tooltip from interfering with mouse events
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default HomePage;
