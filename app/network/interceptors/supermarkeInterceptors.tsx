import {superMarketAxiosInstance} from '../internet';
import AuthSessionService from "../../service/auth/AuthSessionService.tsx";
import {UserProfile} from "../../service/auth/interfaces/UserProfile.tsx";


superMarketAxiosInstance.interceptors.request.use( async function (request) {

    //request.baseURL = 'http://supermarket.staging.generaldrugcentre.com/api/v1/';
    request.baseURL = 'http://supermarket.mystore.test:8001/api/v1/';
    request.headers['Content-Type'] = 'multipart/form-data';


    const authSession = new AuthSessionService();

    const userSession: UserProfile = await authSession.getAuthSession();

    if (userSession.loginStatus) {
        const token = userSession.data?.token;
        if(token) {
            request.headers.Authorization =  'Bearer ' +token.access_token;
        }
    }

    request.transformRequest = [
        function (data) {
            let form_data = new FormData();
            if (!(data instanceof FormData)) {
                for (let key in data) {
                    if (typeof data[key] === 'object') {
                        form_data.append(key, JSON.stringify(data[key]));
                    } else {
                        form_data.append(key, data[key]);
                    }
                }
            } else {
                form_data = data;
            }
            return form_data;
        },
    ];


    return request;
}, function (error) {
    return Promise.reject(error);
});


superMarketAxiosInstance.interceptors.response.use((response) => response, (error) => {
    // whatever you want to do with the error\
    console.log(error);
    switch (error.response.status) {
        case 422:
            return Promise.resolve({
                data : {
                    status : false,
                    error : error.response.data?.error
                }
            })
            break;
        case 404:
            return Promise.resolve({
                data : {
                    status : false,
                    error : "Unknown resources, requested"
                }
            })
        case 401:
            return Promise.resolve({
                data : {
                    status : false,
                    error : error.response.data?.error
                }
            })
            break;
        case 400:
            return Promise.resolve({
                data : {
                    status : false,
                    error : error.response.data?.error
                }
            })
        default:
            return Promise.reject({
                data : {
                    status : false,
                    error : "Unknown error occurred, Please try again"
                }
            })
    }
});

export default superMarketAxiosInstance;
