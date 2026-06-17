import { MarketDetails } from "@/components/PriceChart";

export const fetchMarketAssets = async (query: string) => {
    const response = await fetch(`http://localhost:3000/market/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch market assets');
    }
    const data = await response.json();
    if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
    }
    return data;
};

export const fetchMarketDetails = async (id: string): Promise<MarketDetails[]> => {
    const response = await fetch(`http://localhost:3000/market/details/${encodeURIComponent(id)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch market details');
    }
    const data = await response.json();
    if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
    }
    return data;
};