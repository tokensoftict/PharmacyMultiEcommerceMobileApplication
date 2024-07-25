import AuthSessionService from "../../service/auth/AuthSessionService";
import WholesalesRequest from "../../network/internet/WholesalesRequest";

export default class WholesalesHomeService {

    request : WholesalesRequest
    authSessionService : AuthSessionService
    constructor() {
        this.request = new WholesalesRequest();
        this.authSessionService = new AuthSessionService();
    }

    loadHomePage(){
        return this.request.get("general/home");
    }
}
