import type { Request, Response } from "express";
import MarketService from "../services/market.service";


class MarketController {

    private marketService = new MarketService();

    searchMarket = async(req: Request, res: Response) => {
        const { query } = req.query

        console.log("Searching market with query:", query)
        
        const result = await this.marketService.searchMarket(query as string)
        res.json(result)
    }

}

export default MarketController;