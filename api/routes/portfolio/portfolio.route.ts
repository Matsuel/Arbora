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
            middlewares: [
                authMiddleware
            ],
            handler: asyncHandler(async (req, res) => {
                const result = await controller.createPortfolio(req, res);
                res.json(result);
            })
        }
    ];
}

export default createPortfolioRoutes;