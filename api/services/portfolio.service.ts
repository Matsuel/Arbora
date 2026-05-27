import { prisma } from "../prisma"

export const createPortfolioDB = async (userId: string, name: string, baseCurrency: string) => {
    return prisma.portfolio.create({
        data: {
            baseCurrency,
            userId,
            name,
        },
    })
}