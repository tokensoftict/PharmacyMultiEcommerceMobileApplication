import AuthSessionService from "../../service/auth/AuthSessionService";
import WholesalesRequest from "../../network/internet/WholesalesRequest";


export default class CartService {

    request : WholesalesRequest
    authSessionService : AuthSessionService
    constructor() {
        this.request = new WholesalesRequest();
        this.authSessionService = new AuthSessionService();
    }

    add(productId: number|undefined , quantity: number) {
        return this.request.post("cart/add-item", {stock_id : productId, quantity : quantity});
    }

    remove(productId: number) {
        return this.request.get("cart/"+productId+"/remove-item");
    }

    clear() {
        return this.request.get("cart/clear");
    }

    get() {
        return this.request.get("cart/lists");
    }
}
