import AuthSessionService from "@/service/auth/AuthSessionService";
import { MeiliSearch } from "meilisearch";
import Environment from "@/shared/utils/Environment.tsx";

export default class SearchProductService {
    authSessionService: AuthSessionService;
    meilisearch: MeiliSearch;
    iniFields: any;

    constructor(fields: {
        host: string,
        apiKey: string,
        index: string;
    }) {
        if (fields) Object.assign(this, fields);
        this.authSessionService = new AuthSessionService();
        this.iniFields = fields;
        this.meilisearch = new MeiliSearch({
            host: fields.host,
            apiKey: fields.apiKey,
        });
    }

    /**
     * Search products with a limit of 20 results
     */
    async query(query: string) {
        try {
            const index = this.meilisearch.index(this.iniFields.index);
            await index.updateFilterableAttributes(['wholesales', 'retail', 'admin_status', 'description', 'name']);
            let storeAttribute = Environment.isWholeSalesEnvironment() ? 'wholesales' : 'retail';
            const response = await index.search(query, {
                limit: 20,
                matchingStrategy: 'frequency',
                filter : ['admin_status = true', storeAttribute+' != false']
            });
            return response.hits;
        } catch (error) {
            console.error("Search error:", error);
            return [];
        }
    }

    /**
     * Get popular products
     * Replace the sorting/filtering with your own logic if needed.
     */
    async getPopularProducts({ limit = 12 } = {}) {
        try {
            const index = this.meilisearch.index(this.iniFields.index);
            await index.updateFilterableAttributes(['wholesales', 'retail', 'admin_status', 'description', 'name']);
            let storeAttribute = Environment.isWholeSalesEnvironment() ? 'wholesales' : 'retail';
            const response = await index.search("Peace", {
                limit: limit,
                filter : ['admin_status = true', storeAttribute+' != false']
            });
            return response.hits;
        } catch (error) {
            console.error("Search error:", error);
            return [];
        }
    }
}
