import AuthSessionService from "../../../../service/auth/AuthSessionService";
import WholesalesRequest from "../../../../network/internet/WholesalesRequest";


export default class CategoryService {

    request: WholesalesRequest
    authSessionService: AuthSessionService

    constructor() {
        this.request = new WholesalesRequest();
        this.authSessionService = new AuthSessionService();
    }

    getCategories( page: number) {
        return this.request.get("general/product_categories?page="+page);
    }

}
