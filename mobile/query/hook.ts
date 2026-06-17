import { useQuery } from "@tanstack/react-query";
import { fetchMarketAssets, fetchMarketDetails } from "./queries";

export const useFetchMarketAssets = (query: string) => {
    return useQuery({
        queryKey: ['marketAssets', query],
        queryFn: () => fetchMarketAssets(query),
    });
};

export const useFetchMarketDetails = (id: string) => {
    return useQuery({
        queryKey: ['marketDetails', id],
        queryFn: () => fetchMarketDetails(id),
    });
}