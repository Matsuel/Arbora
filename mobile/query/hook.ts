import { useQuery } from "@tanstack/react-query";
import { fetchMarketAssets } from "./queries";

export const useFetchMarketAssets = (query: string) => {
    return useQuery({
        queryKey: ['marketAssets', query],
        queryFn: () => fetchMarketAssets(query),
    });
};