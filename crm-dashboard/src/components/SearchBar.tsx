import React, { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { FilterConfig } from "@/types";

interface SearchBarProps {
  role?: string | null;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClick?: () => void;
  filterConfig?: FilterConfig;
  placeholder?: string;
  className?: string;
  showFilter?: boolean;
  disabled?: boolean;
}

const SearchBarWithFilter = ({
  searchQuery,
  setSearchQuery,
  onChange,
  onSearchClick,
  placeholder = "Search",
  className = "",
  showFilter = true,
  disabled = false,
}: SearchBarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(
    searchQuery || "",
  );
  const filterRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (!disabled) {
      setIsFilterOpen(!isFilterOpen);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      const value = event.target.value;
      setLocalSearchQuery(value);

      if (setSearchQuery) {
        setSearchQuery(value);
      }
      if (onChange) {
        onChange(event);
      }
    }
  };

  return (
    <div className="relative w-full min-w-80 md:w-auto lg:w-1/3">
      {showFilter && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400">
          <button
            className={`flex items-center justify-center w-6 h-6 ${
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            onClick={handleClick}
            ref={filterRef}
            disabled={disabled}
          >
            <FaSearch size={10} />
          </button>
        </div>
      )}

      <input
        type="search"
        name="search_query"
        placeholder={placeholder}
        value={localSearchQuery}
        disabled={disabled}
        className={`w-full py-2 ${showFilter ? "pl-10" : "pl-4"} pr-10 text-sm border border-secondary-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-navy ${
          disabled ? "bg-gray-100 cursor-not-allowed opacity-50" : ""
        } ${className}`}
        onChange={handleInputChange}
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-secondary-purple">
        <button
          type="submit"
          className={`flex items-center justify-center w-6 h-6 ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={disabled}
          onClick={onSearchClick}
        ></button>
      </div>
    </div>
  );
};

export default SearchBarWithFilter;
