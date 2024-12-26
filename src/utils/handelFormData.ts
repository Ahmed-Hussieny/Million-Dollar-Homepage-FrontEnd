import { AddLogoForm, SelectedCell } from "../interfaces";

export const createFormData = (cellData: SelectedCell[],formik:AddLogoForm) => {
    const apiData = new FormData();
    apiData.append("username", formik.username);
    apiData.append("email", formik.email);
    apiData.append("title", formik.title);
    apiData.append("description", formik.description);
    apiData.append("rows", formik.rows.toString());
    apiData.append("cols", formik.cols.toString());
    apiData.append("logoLink", formik.logoLink);
    if (formik.image) {
      apiData.append("image", formik.image);
    }
    if(cellData){
        cellData.forEach((item, index) => {
        apiData.append(`selectedCells[${index}][cellId]`, item.cellId.toString());
        apiData.append(`selectedCells[${index}][canvasData]`, item.canvasData);
        });
    }
    
    return apiData;
  };