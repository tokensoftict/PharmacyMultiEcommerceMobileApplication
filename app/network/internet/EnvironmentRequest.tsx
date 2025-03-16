import WholesalesRequest from "@/network/internet/WholesalesRequest.tsx";
import SupermarketRequest from "@/network/internet/SupermarketRequest.tsx";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";

export interface EnvironmentRequestInterface {
    post(endpoint: string,  data: any): Promise<any>;
    get(endpoint: string): Promise<any>;
    put(endpoint: string, data: any): Promise<any>;
    remove(endpoint : string): Promise<any>;
}

export default class EnvironmentRequest
{
    private  request : EnvironmentRequestInterface;
    constructor()
    {
        const environment  = new AuthSessionService().getEnvironment();
        this.request = environment === "wholesales" ? new WholesalesRequest() : new SupermarketRequest();
    }

    getRequest() : EnvironmentRequestInterface
    {
        return this.request;
    }
}
