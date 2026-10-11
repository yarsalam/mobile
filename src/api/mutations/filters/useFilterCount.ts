import { useQuery } from "@tanstack/react-query";
import { fetchFilterCount } from "../../queries/fetchFilteredUsers";

export const useFilterCount = (filters: Record<string, any>) =>
  useQuery({
    queryKey: ['filterCount', filters],
    queryFn: () => fetchFilterCount(filters),
    enabled: Object.keys(filters).length > 0,
  });