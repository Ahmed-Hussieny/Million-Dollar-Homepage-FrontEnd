export interface LogosData {
    logos: LogoEntry[];
    numberOfPixelsUsed: number;
  };
  
  export interface LogoEntry {
    pixels: LogoPixel[];
    logoLink: string;
    title : string;
    _id: string;
    success?: boolean;
    email: string;
    username: string;
    description: string;
    rows: string;
    cols: string;
    response?: {
      data: {
        message: string;
        errCode: number;
      } | undefined;
    } | undefined;
  };
  
  interface LogoPixel {
    pixelNumber: number;
    smallImage: string;
    logoLink: string;
    title: string;
  };
  
export interface SelectedCell {
    cellId: number;
    canvasData: string;
  };

export interface LoginForm {
    email: string;
    password: string;
  };
export interface UserData {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  token: string;
  isVerified: boolean;
};

export interface LoginPayload {
  errCode?: number; 
  userToken?: string;
  message?: string;
}

export interface AddLogoForm {
  _id?: string,
  username: string,
  email: string,
  title: string,
  description: string,
  rows: string,
  cols: string,
  logoLink: string,
  image: File | null
};

export interface Pixel {
  username: string;
  email: string;
  title: string;
  description: string;
  position: { x: number; y: number };
  url: string;
  image: File | null;
  size: { width: number; height: number };
}
export const dummyData = [
  {
    "id": "pixel1",
    "position": { "x": 0, "y": 0 },
    "content": "../public/logo.jpeg",
    "size": { "width": 98, "height": 26 },
    "type": "image"
  },
  {
    "id": "pixel1",
    "position": { "x": 100, "y": 100 },
    "content": "../public/logo.jpeg",
    "size": { "width": 15, "height": 5 },
    "type": "image"
  },
  {
    "id": "pixel2",
    "position": { "x": 120, "y": 50 },
    "content": "../public/logo.jpeg",
    "size": { "width": 150, "height": 80 },
    "type": "text"
  },
  {
    "id": "pixel3",
    "position": { "x": 200, "y": 200 },
    "content": "../public/logo.jpeg",
    "size": { "width": 80, "height": 80 },
    "type": "image"
  },
  {
    "id": "pixel4",
    "position": { "x": 300, "y": 100 },
    "content": "Your Ad Here",
    "size": { "width": 200, "height": 100 },
    "type": "text"
  },
  {
    "id": "pixel5",
    "position": { "x": 500, "y": 300 },
    "content": "../public/logo.jpeg",
    "size": { "width": 120, "height": 120 },
    "type": "image"
  },
  {
    "id": "pixel6",
    "position": { "x": 700, "y": 400 },
    "content": "../public/logo.jpeg",
    "size": { "width": 150, "height": 150 },
    "type": "image"
  },
  {
    "id": "pixel7",
    "position": { "x": 850, "y": 500 },
    "content": "../public/logo.jpeg",
    "size": { "width": 60, "height": 60 },
    "type": "image"
  },
  {
    "id": "pixel8",
    "position": { "x": 1000, "y": 600 },
    "content": "../public/logo.jpeg",
    "size": { "width": 180, "height": 80 },
    "type": "text"
  }
]
