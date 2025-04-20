import AuthSessionService from "@/service/auth/AuthSessionService";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";


export default class OrderService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    list(orderType : string) {
        return this.request.get("order/lists?orderType="+orderType);
    }

    get(orderId : any) {
        return this.request.get(`order/${orderId}/show`);
    }
}
