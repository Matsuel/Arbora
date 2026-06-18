import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPortfolio, deletePortfolio, fetchMarketAssets, fetchMarketDetails, fetchPortfolio, isAvailable } from "./queries";

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

export const useFetchPortfolio = (userId: string) => {
    return useQuery({
        queryKey: ['portfolio', userId],
        queryFn: () => fetchPortfolio(userId),
    });
}

export const useCreatePortfolio = (token: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ name, baseCurrency }: { name: string; baseCurrency: string }) =>
            createPortfolio(token, name, baseCurrency),
        onSuccess: () => {
            // Invalide le cache portfolio → refetch automatique sur la home
            queryClient.invalidateQueries({ queryKey: ['portfolio'] })
        },
    })
}

export const useDeletePortfolio = (token: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ portfolioId }: { portfolioId: string }) => deletePortfolio(token, portfolioId),
        onSuccess: () => {
            // Invalide le cache portfolio → refetch automatique sur la home
            queryClient.invalidateQueries({ queryKey: ['portfolio'] })
        },
    })
}