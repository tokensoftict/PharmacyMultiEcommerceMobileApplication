import * as actionTypes from "./actionTypes";

export const setApplicationData = (applicationData:any) => (dispatch:any) => {
  dispatch({
    type : actionTypes.SET_APPLICATION_DATA,
    payload: applicationData,
  })
}


export const setPageRouterData = (pageRouterData:any) => (dispatch:any) => {
  dispatch({
    type : actionTypes.PAGE_ROUTER_DATA,
    payload: pageRouterData,
  })
}

export const setProductDialogData = (productDialogData:any) => (dispatch:any) => {
  dispatch({
    type : actionTypes.PRODUCT_DIALOG_DATA,
    payload: productDialogData,
  })
}
