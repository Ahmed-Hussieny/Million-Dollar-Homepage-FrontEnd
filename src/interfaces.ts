export type LogosData = {
    logos: LogoEntry[];
  };
  
  export type LogoEntry = {
    pixels: LogoPixel[];
    logoLink: string;
  };
  
  type LogoPixel = {
    pixelNumber: number;
    smallImage: string;
    logoLink: string;
    title: string;
  };
  