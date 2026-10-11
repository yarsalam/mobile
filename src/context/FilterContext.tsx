import React, { createContext, useContext, useState, useCallback } from 'react';

interface FilterState {
  [key: string]: any;
}

interface FilterContextType {
  filters: FilterState;
  activeFilterCount: number;
  setFilters: (f: FilterState) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType>({} as any);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFiltersState] = useState<FilterState>({});

  const activeFilterCount = Object.keys(filters).filter(key => {
    const val = filters[key];
    if (val === undefined || val === '' || val === null) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'boolean') return val === true;
    return true;
  }).length;

  const setFilters = useCallback((newFilters: FilterState) => {
    setFiltersState(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  return (
    <FilterContext.Provider value={{ filters, activeFilterCount, setFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);