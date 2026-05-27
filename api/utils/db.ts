import { prisma } from "../prisma";

export const dbHealthCheck = async () => {
    try {
        // Requête de test simple pour vérifier que la base de données répond
        await prisma.$queryRaw`SELECT 1`;
        console.log("🔌 Database connection successful, API can start...");
    } catch (_error) {
        console.error("⚠️ Database connection failed, API cannot start exiting...");
        process.exit(1);
    }
}

export const isDbConnected = async (): Promise<boolean> => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch (_error) {
        return false;
    }
}