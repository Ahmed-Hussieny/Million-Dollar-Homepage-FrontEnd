export interface LogosData {
    logos: LogoEntry[];
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