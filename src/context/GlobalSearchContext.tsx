import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface GlobalSearchContextType {
  isGlobalSearchOpen: boolean;
  openGlobalSearch: () => void;
  closeGlobalSearch: () => void;
  toggleGlobalSearch: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  isSearching: boolean;
  performSearch: (query: string) => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

export const useGlobalSearch = () => {
  const context = useContext(GlobalSearchContext);
  if (!context) {
    throw new Error('useGlobalSearch must be used within a GlobalSearchProvider');
  }
  return context;
};

interface GlobalSearchProviderProps {
  children: ReactNode;
}

export const GlobalSearchProvider: React.FC<GlobalSearchProviderProps> = ({ children }) => {
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const openGlobalSearch = () => setIsGlobalSearchOpen(true);
  const closeGlobalSearch = () => setIsGlobalSearchOpen(false);
  const toggleGlobalSearch = () => setIsGlobalSearchOpen(prev => !prev);

  const performSearch = async (_query: string) => {
    // Placeholder for search functionality
    setSearchResults([]);
    setIsSearching(false);
  };

  // Gestion des raccourcis clavier (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        toggleGlobalSearch();
      }
      if (event.key === 'Escape') {
        closeGlobalSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Effectuer la recherche quand la requête change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const value: GlobalSearchContextType = {
    isGlobalSearchOpen,
    openGlobalSearch,
    closeGlobalSearch,
    toggleGlobalSearch,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    performSearch,
  };

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
    </GlobalSearchContext.Provider>
  );
};