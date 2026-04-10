import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGlobal = () =>
  useQuery({
    queryKey: ['global'],
    queryFn: async () => {
      const { data } = await axios.get('/api/global');
      return data;
    },
    refetchInterval: 60000,
    staleTime: 55000,
  });
