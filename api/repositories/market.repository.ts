import YahooFinance from "yahoo-finance2/src/index.ts";

export interface IMarketRepository {
    search(query: string): Promise<any[]>
}

class MarketRepository implements IMarketRepository {

    private static yahooFinance = new YahooFinance();

    async search(query: string): Promise<any[]> {
        const results = await MarketRepository.yahooFinance.search(query)
        console.log("Yahoo Finance search results:", results)
        return results.quotes.map((quote: any) => ({
            symbol: quote.symbol,
            name: quote.shortname || quote.longname || quote.symbol,
            exchange: quote.exchange,
            type: quote.quoteType,
        }))
    }
}

export default MarketRepository;