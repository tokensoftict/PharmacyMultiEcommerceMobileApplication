import AuthSessionService from "../../../service/auth/AuthSessionService";
import WholesalesRequest from "../../../network/internet/WholesalesRequest";

export default class ProductService {

    request : WholesalesRequest
    authSessionService : AuthSessionService
    constructor() {
        this.request = new WholesalesRequest();
        this.authSessionService = new AuthSessionService();
    }
    getProduct(product_id : number){
        return this.request.get("stock/"+product_id+"/show");
    }

}
