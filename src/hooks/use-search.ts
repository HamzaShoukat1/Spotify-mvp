import { searchProducts } from "@/services/search.service";
import { useQuery } from "@tanstack/react-query";




export function UseSearchArtistandMusic(query: string) {
    return useQuery({
        queryKey: ['artist', 'msuic', query],
        queryFn: () => searchProducts(query),
        enabled: query.trim().length > 0,
    });
}