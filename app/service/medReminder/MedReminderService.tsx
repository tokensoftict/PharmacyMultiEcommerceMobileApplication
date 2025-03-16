import AuthSessionService from "../auth/AuthSessionService.tsx";
import EnvironmentRequest, {EnvironmentRequestInterface} from "@/network/internet/EnvironmentRequest.tsx";

export default class MedReminderService {

    request: EnvironmentRequestInterface
    authSessionService: AuthSessionService

    constructor() {
        this.request = new EnvironmentRequest().getRequest();
        this.authSessionService = new AuthSessionService();
    }

    list() {
        return this.request.get("med-reminder/list");
    }


    create(data: any) {
        return this.request.post("med-reminder/create", data);
    }

    update(data: any, id : number | string) {
        return this.request.post("med-reminder/"+id+"/update", data);
    }

    remove(id : number | string) {
        return this.request.get("med-reminder/"+id+"/remove");
    }


    loadTodayHistory(filter? : string) {
        if(filter) {
            return this.request.get("med-reminder/today-history?filter="+filter);
        }
        return this.request.get("med-reminder/today-history");
    }
}
