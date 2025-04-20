import AsyncStorage from "@react-native-async-storage/async-storage";
import * as action from "@/redux/actions";
import { store } from "@/redux/store/store";

export default class AuthSessionService{
    /**
     * @param data
     */
    setAuthSession(data :any) {
        AsyncStorage.setItem("auth", JSON.stringify(data));
        store.dispatch(action.setApplicationData(data))
    }

    setMedReminderData(data :any) {
        AsyncStorage.setItem("medReminderData", JSON.stringify(data));
    }

    getMedReminderData() :any {
       return AsyncStorage.getItem("medReminderData") ?? []
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
            const response = await fetch("http://auth.mystore.test:8001/api/v1/account/me?deviceKey="+store.getState().systemReducer.fireBaseKey, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, // Attach token here
                    "Content-Type": 'multipart/form-data',
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
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
}
