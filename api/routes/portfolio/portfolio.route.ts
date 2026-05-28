import PortfolioController from "../../controllers/portfolio.controller";
import authMiddleware from "../../middleware/auth.middleware";
import type { RouteDescriptor } from "../../models/route.model";
import asyncHandler from "../../utils/handler";

const createPortfolioRoutes = (): RouteDescriptor[] => {

    const controller = new PortfolioController();

    const prefix = "/portfolio";

    return [
        {
            method: "post",
            path: `${prefix}`,
            middlewares: [authMiddleware],
            handler: asyncHandler(controller.createPortfolio)
        },
        {
            method: "get",
            path: `${prefix}`,
            middlewares: [authMiddleware],
            handler: asyncHandler(controller.getAllPortfolios)
        },
        {
            method: "get",
            path: `${prefix}/:id`,
            middlewares: [authMiddleware],
            handler: asyncHandler(controller.getPortfolio)
        },
        {
            method: "patch",
            path: `${prefix}/:id`,
            middlewares: [authMiddleware],
            handler: asyncHandler(controller.updatePortfolio)
        },
        {
            method: "delete",
            path: `${prefix}/:id`,
            middlewares: [authMiddleware],
            handler: asyncHandler(controller.deletePortfolio)
        }
    ];
}

export default createPortfolioRoutes;