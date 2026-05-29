import YahooFinance from "yahoo-finance2/src/index.ts";
import type { MarketData } from "../interfaces/market.interface";

export interface IMarketRepository {
    search(query: string): Promise<MarketData[]>
}

class MarketRepository implements IMarketRepository {

    private static yahooFinance = new YahooFinance();

    async search(query: string): Promise<MarketData[]> {
        const results = await MarketRepository.yahooFinance.search(query)
        
        const formattedResults: MarketData[] = results.quotes.map((quote: any) => ({
            symbol: quote.symbol,
            name: quote.shortname || quote.longname || quote.symbol,
            exchange: quote.exchange,
            assetType: quote.quoteType,
        }))

        return formattedResults.filter((item) => item.name && item.exchange && item.assetType)
    }
}

export default MarketRepository;