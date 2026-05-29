import BadRequestError from "../errors/badrequest.error";
import MarketRepository, { type IMarketRepository } from "../repositories/market.repository";


class MarketService {

    repo: IMarketRepository = new MarketRepository()

    async searchMarket(query: string) {
        if (!query || query.trim().length < 2) {
            throw new BadRequestError("Query must be at least 2 characters")
        }
        return this.repo.search(query.trim())
    }
}

export default MarketService;