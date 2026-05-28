export interface CreatePortfolioDTO {
    name: string
    baseCurrency: string
}

export interface UpdatePortfolioDTO {
    name?: string
    baseCurrency?: string
}