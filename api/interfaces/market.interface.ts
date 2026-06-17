export interface MarketData {
    symbol: string
    name: string
    exchange: string
    assetType: string
    logoUrl?: string
}

export interface MarketDetails {
    date: string
    price: number
}