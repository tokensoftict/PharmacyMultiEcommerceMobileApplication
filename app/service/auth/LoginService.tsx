import Request from "../../network/internet/request.tsx";
import AuthSessionService from "./AuthSessionService.tsx";
import {store} from "@/redux/store/store.tsx";
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


    logout() {
        let parent = this;
        return new Promise(function (resolve : any, reject : any){
            parent.request.get("logout")
                .then(function (response : any){
                    console.log(response.toString());
                    if(response.data.status === true){
                        resolve(new AuthSessionService().destroySession())
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
        })
    }


    me() {
        let parent = this;
        return new Promise(function (resolve : any, reject : any){
            parent.request.get("me?deviceKey=" + store.getState().systemReducer.fireBaseKey)
                .then(function (response : any){
                    console.log(response)
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
                    console.log(error);
                    reject(error)
                });
        });
    }


    /**
     * @param error
     */
    parseError(error: any)
    {
        console.log(error);
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
