import AuthSessionService from "@/service/auth/AuthSessionService.tsx";

function isWholeSalesEnvironment(): boolean {
    return new AuthSessionService().getEnvironment() === "wholesales";
}

function isSuperMarketEnvironment(): boolean {
    return new AuthSessionService().getEnvironment() === "supermarket";
}


export default {
    isWholeSalesEnvironment : isWholeSalesEnvironment,
    isSuperMarketEnvironment : isSuperMarketEnvironment,
}
