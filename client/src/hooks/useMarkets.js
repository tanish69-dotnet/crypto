import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useCryptoStore from '../store/useCryptoStore';

export const useMarkets = () => {
  const currency = useCryptoStore((s) => s.currency);
  return useQuery({
    queryKey: ['markets', currency],
    queryFn: async () => {
      const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', { 
        params: { 
          vs_currency: currency, 
          order: 'market_cap_desc', 
          per_page: 50, 
          page: 1, 
          sparkline: true, 
          price_change_percentage: '24h' 
        } 
      });
      return data;
    },
    refetchInterval: 30000,
    staleTime: 25000,
  });
};
