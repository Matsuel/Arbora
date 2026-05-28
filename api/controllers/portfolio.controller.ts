import type { Request, Response } from "express"
import PortfolioService from "../services/portfolio.service"

class PortfolioController {

    private portfolioService = new PortfolioService()

    createPortfolio = async (req: Request, res: Response) => {
        const { name, baseCurrency } = req.body
        
        try {
            const portfolio = await this.portfolioService.create(req.userId!, name, baseCurrency)
            res.status(201).json(portfolio)
        } catch (error) {
            res.status(500).json({ message: "Failed to create portfolio", error })
        }
    }

};

export default PortfolioController;