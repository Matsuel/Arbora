import YahooFinance from "yahoo-finance2/src/index.ts";
import { env } from "../env";
import type { MarketData, MarketDetails } from "../interfaces/market.interface";

export interface IMarketRepository {
    search(query: string): Promise<MarketData[]>
    getDetails(id: string): Promise<MarketDetails[]>
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

    async getDetails(id: string): Promise<MarketDetails[]> {
        const details = await MarketRepository.yahooFinance.chart(id, {
            period1: new Date(0)
        })

        if (!details) {
            throw new Error(`No details found for id: ${id}`)
        }

        const formattedResult: MarketDetails[] = details.quotes.map((quote: any) => ({
            date: quote.date,
            price: quote.close,
        }))

        return formattedResult
    }
}

export default MarketRepository;