function SearchDropdown({
  isVisible,
  loading,
  results,
  highlightedIndex,
  onSelect,
  onHover,
  query,
}) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="search-dropdown">
      {loading ? <p className="search-status">Searching...</p> : null}

      {!loading && query && !results.length ? <p className="search-status">No users found</p> : null}

      {!loading && results.length ? (
        <ul className="search-list">
          {results.map((user, index) => (
            <li
              key={user.id}
              className={`search-item ${highlightedIndex === index ? "is-active" : ""}`}
              onMouseEnter={() => onHover(index)}
              onMouseDown={(event) => {
                event.preventDefault();
                onSelect(user);
              }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="search-avatar" />
              ) : (
                <div className="search-avatar search-avatar-fallback">
                  {user.username?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default SearchDropdown;
