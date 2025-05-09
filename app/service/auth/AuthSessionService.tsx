import AsyncStorage from "@react-native-async-storage/async-storage";
import * as action from "@/redux/actions";
import { store } from "@/redux/store/store";
import {AUTH_URL} from "@env";

export default class AuthSessionService{
    /**
     * @param data
     */
    setAuthSession(data :any) {
        AsyncStorage.setItem("auth", JSON.stringify(data));
        store.dispatch(action.setApplicationData(data))
    }

    setTempSession(data :any) {
        store.dispatch(action.setApplicationData(data))
    }

    completeSession() {
        const data =store.getState().systemReducer.auth;
        AsyncStorage.setItem("auth", JSON.stringify(data));
    }

    async getIntroPageStatus() {
        return await AsyncStorage.getItem("hasShownIntroPage") ?? "NO";
    }

    setIntroPageStatus(status : string) {
        AsyncStorage.setItem("hasShownIntroPage", "YES")
    }

    async destroySession() {
        await AsyncStorage.removeItem("auth");
        store.dispatch(action.setApplicationData({}));
        store.dispatch(action.setLaunchPage(""));
        store.dispatch(action.setEnvironment(""));
        return true
    }

    fetchData = async (token : string) => {
        try {
            const response = await fetch(AUTH_URL+"me?deviceKey="+store.getState().systemReducer.fireBaseKey, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, // Attach token here
                    "Content-Type": 'multipart/form-data',
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
                console.log(response.body);
                return response;
            }

            return await response.json();

        } catch (error) {
            return error;
        }
    };


    async autoLogin()  {
        let data = await AsyncStorage.getItem("auth") ?? false;
        if(!data) return false;
        const session = JSON.parse(data)
        store.dispatch(action.setApplicationData(session));
        data = JSON.parse(data);
        // @ts-ignore
        const refreshData = await this.fetchData(data.data.token.access_token)
        if(refreshData.status === true) {
            refreshData['loginStatus'] = true;
            console.log("refreshData", refreshData.status)
            this.setAuthSession(refreshData);
            return true;
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


    setLaunchPage(page:string) {
        store.dispatch(action.setLaunchPage(page));
    }

    getLaunchPage() {
        return store.getState().systemReducer.launchPage;
    }

    removeLaunchPage() {
        store.dispatch(action.setLaunchPage(""));
    }

    setImpersonateCustomerData(data :any) {
        store.dispatch(action.setImpersonateData(data));
    }

    getImpersonateCustomerData() {
        return store.getState().systemReducer.impersonateData ?? false;
    }

    removeImpersonateCustomerData() {
        store.dispatch(action.setImpersonateData(false));
    }

    getPageSessionData(key:string) {
        if(store.getState().systemReducer.pageRouteData.hasOwnProperty(key)){
            return store.getState().systemReducer.pageRouteData[key];
        }
        return "";
    }

    setTrashedUserData(data :any) {
        store.dispatch(action.setTrashedUserData(data));
    }

    getTrashedUserData() {
        return store.getState().systemReducer.trashedUserData ?? false;
    }
}
