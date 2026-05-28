import BadRequestError from "../errors/badrequest.error"
import PortfolioRepository, { type IPortfolioRepository } from "../repositories/portfolio.repository"

class PortfolioService {
    repo: IPortfolioRepository = new PortfolioRepository()

    async create(userId: string, name: string, baseCurrency: string) {
        if (!name || !baseCurrency) {
            throw new BadRequestError("Name and base currency are required")
        }
        return this.repo.create(userId, { name, baseCurrency })
    }
}

export default PortfolioService