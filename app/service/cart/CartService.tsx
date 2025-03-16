import AuthSessionService from "../../service/auth/AuthSessionService";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";


export default class CartService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
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
