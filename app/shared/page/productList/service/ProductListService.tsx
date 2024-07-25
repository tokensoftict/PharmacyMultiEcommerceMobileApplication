import AuthSessionService from "../../../../service/auth/AuthSessionService";
import WholesalesRequest from "../../../../network/internet/WholesalesRequest";


export default class ProductListService {

    request: WholesalesRequest
    authSessionService: AuthSessionService

    constructor() {
        this.request = new WholesalesRequest();
        this.authSessionService = new AuthSessionService();
    }

    getProduct(endpoint : string, page : number){
        return this.request.get(endpoint+"?page="+page);
    }
}
