import { useQuery } from "@tanstack/react-query";
import { fetchMarketAssets, fetchMarketDetails, isAvailable } from "./queries";

export const useFetchMarketAssets = (query: string) => {
    return useQuery({
        queryKey: ['marketAssets', query],
        queryFn: () => fetchMarketAssets(query),
    });
};

export const useFetchMarketDetails = (id: string, period: string) => {
    return useQuery({
        queryKey: ['marketDetails', id, period],
        queryFn: () => fetchMarketDetails(id, period),
    });
}

export const useIsAvailable = () => {
    return useQuery({
        queryKey: ['isAvailable'],
        queryFn: () => isAvailable(),
    });
}