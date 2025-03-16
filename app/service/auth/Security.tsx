import Request from "../../network/internet/request.tsx";
import AuthSessionService from "./AuthSessionService.tsx";

export default class Security
{
    request : Request
    authSessionService : AuthSessionService

    constructor() {
        this.request = new Request();
        this.authSessionService = new AuthSessionService()
    }


    changePassword(
        oldPassword: string,
        newPassword: string,
        confirmPassword: string
    ){

        return this.request.post('change-password',
            {
                old_password: oldPassword,
                password: newPassword,
                password_confirmation: confirmPassword
            }
            )

    }
}
