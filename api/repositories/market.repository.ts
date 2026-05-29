import YahooFinance from "yahoo-finance2/src/index.ts";
import { env } from "../env";
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
            logoUrl: quote.symbol && env.LOGO_DEV_TOKEN
                ? `https://img.logo.dev/ticker/${quote.symbol}?token=${env.LOGO_DEV_TOKEN}&size=64`
                : undefined,
        }))

        return formattedResults.filter((item) => item.name && item.exchange && item.assetType)
    }
}

export default MarketRepository;