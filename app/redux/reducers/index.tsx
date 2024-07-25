import * as actionTypes from "../actions/actionTypes.tsx";
import {Data, UserProfile} from "../../service/auth/interfaces/UserProfile.tsx";
import {ProductListInterface} from "@/service/product/ProductListInterface.tsx";
import {Float} from "react-native/Libraries/Types/CodegenTypes";
import {Data as pData} from "@/service/product/show/interface/ProductInformationInterface.tsx";



const userprofile: UserProfile = {
  status:  undefined,
  loginStatus:  undefined,
  data:  undefined,
};

const product: ProductListInterface|pData|undefined = undefined;


const systemDataInitialState = {
  auth : userprofile,
  product : product,
  pageRouteData : {

  }
};


function systemReducer(state = systemDataInitialState, action:any){
  switch (action.type) {
    case actionTypes.SET_APPLICATION_DATA:
      return { ...state, auth: action.payload };
    case actionTypes.PAGE_ROUTER_DATA:
      return { ...state, pageRouteData: action.payload };
    case actionTypes.PRODUCT_DIALOG_DATA:
      return { ...state, product: action.payload };
    default:
      return state;
  }
}

export {systemReducer} ;
