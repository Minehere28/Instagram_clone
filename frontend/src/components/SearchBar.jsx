import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import useDebounce from "../hooks/useDebounce";
import SearchDropdown from "./SearchDropdown";

function SearchBar() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function searchUsers() {
      const trimmed = debouncedQuery.trim();
      if (!trimmed) {
        if (mounted) {
          setResults([]);
          setLoading(false);
          setHighlightedIndex(-1);
        }
        return;
      }

      setLoading(true);
      try {
        const response = await api.get("users/search/", { params: { q: trimmed } });
        const payload = response.data?.data || response.data;
        const users = Array.isArray(payload) ? payload.slice(0, 10) : [];
        if (mounted) {
          setResults(users);
          setHighlightedIndex(users.length ? 0 : -1);
        }
      } catch (_error) {
        if (mounted) {
          setResults([]);
          setHighlightedIndex(-1);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    searchUsers();

    return () => {
      mounted = false;
    };
  }, [debouncedQuery]);

  const handleSelect = (user) => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    navigate(`/profile/${user.username}`);
  };

  const handleKeyDown = (event) => {
    if (!showDropdown || !results.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % results.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    }

    if (event.key === "Enter" && highlightedIndex >= 0) {
      event.preventDefault();
      handleSelect(results[highlightedIndex]);
    }

    if (event.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div className="search-wrap" ref={wrapperRef}>
      <input
        type="text"
        className="search-input"
        placeholder="Search users"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
      />

      <SearchDropdown
        isVisible={showDropdown && (!!query.trim() || loading)}
        loading={loading}
        results={results}
        highlightedIndex={highlightedIndex}
        onSelect={handleSelect}
        onHover={setHighlightedIndex}
        query={query.trim()}
      />
    </div>
  );
}

export default SearchBar;
