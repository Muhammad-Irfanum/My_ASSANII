// hooks/useCitySearch.js
import { useState } from "react";
import axios from "axios";

export const useCitySearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchCity = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${query},Pakistan&format=json&addressdetails=1&limit=3&accept-language=en`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching city data:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return { searchResults, isSearching, searchCity };
};