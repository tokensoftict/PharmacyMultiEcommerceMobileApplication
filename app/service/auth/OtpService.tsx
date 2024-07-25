import Request from "../../network/internet/request.tsx";
import AuthSessionService from "./AuthSessionService.tsx";

export default class OtpService
{
    request : Request
    authSessionService : AuthSessionService

    constructor() {
        this.request = new Request();
        this.authSessionService = new AuthSessionService()
    }


    /**
     *
     * @param otp
     * @param phone
     */
    validateOTP(otp: string, phone: string | undefined) {
        return this.request.post('verify-phone', {phone : phone, 'otp' : otp});
    }

    /**
     *
     * @param phone
     */
    requestForOtp(phone: string|undefined){
        return this.request.post('resend-verification', {phone : phone});
    }

}
