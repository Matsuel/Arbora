import type { Portfolio } from "../generated/prisma/client"
import type { CreatePortfolioDTO } from "../interfaces/portfolio.interface"
import { prisma } from "../prisma"

export interface IPortfolioRepository {
    create(userId: string, data: CreatePortfolioDTO): Promise<Portfolio>
}

class PortfolioRepository implements IPortfolioRepository {
    async create(userId: string, data: CreatePortfolioDTO): Promise<Portfolio> {
        return prisma.portfolio.create({
            data: { ...data, userId },
        })
    }
}

export default PortfolioRepository