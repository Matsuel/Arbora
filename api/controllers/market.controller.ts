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

    getMarketDetails = async(req: Request, res: Response) => {
        const { id } = req.params

        console.log("Getting market details for id:", id)
        
        const result = await this.marketService.getMarketDetails(id as string)
        res.json(result)
    }

}

export default MarketController;