import React from 'react';

const SearchBar = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <input
      onChange={handleChange}
      placeholder="Search movies..."
      className="p-2 border rounded w-full mb-4 text-black"
    />
  );
};

export default SearchBar;
