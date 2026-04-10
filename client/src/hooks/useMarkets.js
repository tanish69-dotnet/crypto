import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useCryptoStore from '../store/useCryptoStore';

export const useMarkets = () => {
  const currency = useCryptoStore((s) => s.currency);
  return useQuery({
    queryKey: ['markets', currency],
    queryFn: async () => {
      const { data } = await axios.get('/api/markets', { params: { currency } });
      return data;
    },
    refetchInterval: 30000,
    staleTime: 25000,
  });
};
