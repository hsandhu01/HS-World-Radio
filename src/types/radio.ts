export interface RadioStation {
    id: string;
    name: string;
    url: string;
    country: string;
    countryCode: string;
    language: string;
    genre: string;
    votes: number;
    favicon: string;
    clickCount: number;
  }
  
  export interface SearchOverlayProps {
    onSearch: (query: string) => void;
    isSearching: boolean;
  }
  
  export interface LoadingOverlayProps {
    message?: string;
  }