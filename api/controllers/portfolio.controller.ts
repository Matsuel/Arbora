import type { Request, Response } from "express"
import { createPortfolioDB } from "../services/portfolio.service"

class PortfolioController {
    createPortfolio = async (req: Request, res: Response) => {
        const userId = req.userId!
        const { name, baseCurrency } = req.body
        if (!name || !baseCurrency) {
            return res.status(400).json({ message: "Name and base currency are required" })
        }

        try {
            const portfolio = await createPortfolioDB(userId, name, baseCurrency)
            res.status(201).json(portfolio)
        } catch (error) {
            res.status(500).json({ message: "Failed to create portfolio", error })
        }
    }

};

export default PortfolioController;