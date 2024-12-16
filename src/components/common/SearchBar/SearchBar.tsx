import React, { useState, useEffect } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder: string;
  debounceDelay: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder, debounceDelay }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceDelay);

    return () => {
      clearTimeout(handler); // Cleanup the timeout on unmount or when searchTerm changes
    };
  }, [searchTerm, onSearch, debounceDelay]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
