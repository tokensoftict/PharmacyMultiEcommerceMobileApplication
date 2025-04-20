import AuthSessionService from "@/service/auth/AuthSessionService";
import { MeiliSearch } from 'meilisearch';



export default class SearchProductService {
    authSessionService : AuthSessionService
    meilisearch : MeiliSearch
    iniFields : any

    constructor(fields: {
        host: string,
        apiKey: string,
        index: string
    }) {
        if (fields) Object.assign(this, fields);
        this.authSessionService = new AuthSessionService();
        this.iniFields = fields;
        this.meilisearch = new MeiliSearch({
            host: fields.host,
            apiKey : fields.apiKey,
        })
    }

    async query(query: string) {
        try {
            const index = this.meilisearch.index(this.iniFields.index)
            //await index.updateFilterableAttributes(['is_wholesales']);

            const response = await index.search(query);

            return response.hits;
        } catch (error) {
            return [];
        }
    }


}
