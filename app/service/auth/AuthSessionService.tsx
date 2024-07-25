import AsyncStorage from "@react-native-async-storage/async-storage";
import * as action from "../../redux/actions";
import { store } from "../../redux/store/store";
export default class AuthSessionService{
    /**
     * @param data
     */
    setAuthSession(data :any) {
        AsyncStorage.setItem("auth", JSON.stringify(data));
        store.dispatch(action.setApplicationData(data))
    }

    getAuthSession() {
        return store.getState().systemReducer.auth;
    }

    setPageSessionData(key : string, value : any) {
        const data = store.getState().systemReducer.pageRouteData;
        data[key] = value;
        store.dispatch(action.setPageRouterData(data));
    }

    getPageSessionData(key:string) {
        if(store.getState().systemReducer.pageRouteData.hasOwnProperty(key)){
            return store.getState().systemReducer.pageRouteData[key];
        }
        return null;
    }
}
