import AuthSessionService from "@/service/auth/AuthSessionService";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";


export default class OrderService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    list() {
        return this.request.get("order/lists");
    }

    get(orderId : any) {
        return this.request.get(`order/${orderId}/show`);
    }
}
