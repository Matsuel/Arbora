import MarketController from "../../controllers/market.controller";
import authMiddleware from "../../middleware/auth.middleware";
import type { RouteDescriptor } from "../../models/route.model";
import asyncHandler from "../../utils/handler";

const createMarketRoutes = (): RouteDescriptor[] => {

    const controller = new MarketController();

    const prefix = "/market";

    return [
        {
            method: "get",
            path: `${prefix}/search`,
            // middlewares: [authMiddleware],
            handler: asyncHandler(controller.searchMarket)
        },
        {
            method: "get",
            path: `${prefix}/details/:id`,
            handler: asyncHandler(controller.getMarketDetails)
        }
    ];
}

export default createMarketRoutes;