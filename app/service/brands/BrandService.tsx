import AuthSessionService from "../auth/AuthSessionService.tsx";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";


export default class BrandService {

    request : EnvironmentRequestInterface
    authSessionService : AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    getBrands( page: number) {
        return this.request.get("general/product_manufacturers?page="+page);
    }

}
