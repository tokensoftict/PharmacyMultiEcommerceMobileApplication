import AsyncStorage from "@react-native-async-storage/async-storage";
import * as action from "@/redux/actions";
import { store } from "@/redux/store/store";
import LoginService from "@/service/auth/LoginService.tsx";
export default class AuthSessionService{
    /**
     * @param data
     */
    setAuthSession(data :any) {

        AsyncStorage.setItem("auth", JSON.stringify(data));
        store.dispatch(action.setApplicationData(data))
    }

    destroySession() {
        AsyncStorage.removeItem("auth");
        store.dispatch(action.setApplicationData([]));
        return true
    }

    async autoLogin()  {
        const data = await AsyncStorage.getItem("auth");
        if(data){
           // await new LoginService().me()
        }
        if(data){
            const session = JSON.parse(data)
            store.dispatch(action.setApplicationData(session));

            return this.getAuthSession();
        }
        return false;
    }

    getAuthSession() {
        return store.getState().systemReducer.auth;
    }

     setPageSessionData(key : string, value : any)  {
        const data = store.getState().systemReducer.pageRouteData;
        data[key] = value;
        store.dispatch(action.setPageRouterData(data));
    }


    setEnvironment(environment :string) {
        store.dispatch(action.setEnvironment(environment));
    }

    getEnvironment() {
        return store.getState().systemReducer.environment;
    }

    getPageSessionData(key:string) {
        if(store.getState().systemReducer.pageRouteData.hasOwnProperty(key)){
            return store.getState().systemReducer.pageRouteData[key];
        }
        return "";
    }
}
