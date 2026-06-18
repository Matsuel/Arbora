import { MarketDetails } from "@/components/PriceChart";

export const fetchMarketAssets = async (query: string) => {
    const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_HOST}:3000/market/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch market assets');
    }
    const data = await response.json();
    if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
    }
    return data;
};

export const fetchMarketDetails = async (id: string, period: string): Promise<MarketDetails[]> => {
    const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_HOST}:3000/market/details/${encodeURIComponent(id)}?period=${encodeURIComponent(period)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch market details');
    }
    const data = await response.json();
    if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
    }
    return data;
};

export const isAvailable = async (): Promise<boolean> => {
    const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_HOST}:3000/status`);
    if (!response.ok) {
        return false;
    }
    return true;
};

export const fetchPortfolio = async (userId: string): Promise<any> => {
    const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_HOST}:3000/portfolio`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userId}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch portfolio');
    }
    const data = await response.json();
    return data;
};

export const createPortfolio = async (
    token: string,
    name: string,
    baseCurrency: string
): Promise<any> => {
    const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_HOST}:3000/portfolio`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, baseCurrency }),
    })
    if (!response.ok) throw new Error('Failed to create portfolio')
    return response.json()
}

export const deletePortfolio = async (token: string, portfolioId: string): Promise<void> => {
    const response = await fetch(`http://${process.env.EXPO_PUBLIC_API_HOST}:3000/portfolio/${encodeURIComponent(portfolioId)}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete portfolio');
    }
};