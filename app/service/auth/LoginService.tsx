import Request from "../../network/internet/request.tsx";
import AuthSessionService from "./AuthSessionService.tsx";
import {store} from "@/redux/store/store.tsx";
import {scheduleNotification} from "@/shared/utils/ScheduleNotification.tsx";
import dayjs from "dayjs";
import notifee from "@notifee/react-native";
export default class LoginService
{
    request : Request
    authSessionService : AuthSessionService
    constructor() {
        this.request = new Request();
        this.authSessionService = new AuthSessionService()
    }

    /**
     * @param email
     * @param password
     */
    login(email : string, password : string) {
        let parent = this;
        return new Promise(function (resolve : any, reject : any){
            parent.request.post("login", {email : email, password : password, deviceKey : store.getState().systemReducer.fireBaseKey})
                .then(async function (response : any){
                    if(response.data.status === true){
                        await Promise.all(
                            response.data.data.medSchedules.map(async (schedule : any) => {
                                const  notificationId =  await scheduleNotification(
                                    schedule.id,
                                    schedule.drugName,
                                    schedule.dosage,
                                    "mg",
                                    // @ts-ignore
                                    new Date(dayjs(schedule.js_date)).getTime(),
                                    schedule,
                                    "supermarket",
                                    "VIEW_MED_REMINDER",
                                );
                                return { [schedule.id]: notificationId };
                            })
                        );

                        resolve(parent.prepareUserSession(response.data))
                    }else{
                        resolve(
                            parent.parseError({
                                error : response.data.error,
                                message : response.data.message
                            })
                        )
                    }
                }, function (error) {
                    reject(error)
                });
        });
    }


    async logout() {
        const response = await this.request.get("logout");
        if (response.data.status === true) {
            await new AuthSessionService().destroySession()
            const schedulesIDS = response.data.data;
            await  Promise.all(
                schedulesIDS.map(async (schedule : any) => {
                    await notifee.cancelNotification(schedule);
                })
            )
            return true;
        }
        return false;
    }


    me() {
        let parent = this;
        return new Promise(function (resolve : any, reject : any){
            parent.request.get("me?deviceKey=" + store.getState().systemReducer.fireBaseKey)
                .then(function (response : any){
                    if(response.data.status === true){
                        resolve(parent.prepareUserSession(response.data))
                    }else{
                        resolve(
                            parent.parseError({
                                error : response.data.error,
                                message : response.data.message
                            })
                        )
                    }
                }, function (error) {
                    reject(error)
                });
        });
    }


    /**
     * @param error
     */
    parseError(error: any)
    {
        const errorParse = {
            email : false,
            password : false,
            message : false,
            status : false
        }

        if(error.hasOwnProperty('error') && error.error.hasOwnProperty('email')){
            errorParse.email = error.error.email.join("\\n");
        }

        if(error.hasOwnProperty('error') && error.error.hasOwnProperty('password')){
            errorParse.password = error.error.password.join("\\n");
        }

        if(!errorParse.password && !errorParse.email){
            errorParse.message = error.message
        }

        return errorParse;
    }

    /**
     * @param response
     */
    prepareUserSession(response: any) : object{
        response['loginStatus'] = true;
        this.authSessionService.setAuthSession(response);
        return {
            status : true,
            message : "Login Successful"
        }
    }

}
