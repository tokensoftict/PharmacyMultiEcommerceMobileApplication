import wholesalesAxiosInstance from "../interceptors/wholesalesInterceptors";

export default class WholesalesRequest{

    /**
     *
     * @param endpoint
     * @param data
     */
    post(endpoint: string,  data: any)
    {
        return wholesalesAxiosInstance.post(endpoint, data)
    }

    /**
     *
     * @param endpoint
     */
    get(endpoint: string)
    {
        return wholesalesAxiosInstance.get(endpoint)
    }

    /**
     *
     * @param endpoint
     * @param data
     */
    put(endpoint: string, data: any)
    {
        return wholesalesAxiosInstance.put(endpoint, data);
    }

    /**
     *
     * @param endpoint
     */
    remove(endpoint : string)
    {
        return wholesalesAxiosInstance.delete(endpoint);
    }

}
