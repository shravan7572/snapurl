import "./SearchBar.css"

export default function SearchBar({ value, onChange, placeholder = "Search links…" }) {
    return (
        <div className="search-bar">
            <svg className="search-bar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" />
            </svg>
            <input
                type="search"
                className="search-bar-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            {value && (
                <button type="button" className="search-bar-clear" onClick={() => onChange("")} aria-label="Clear search">
                    ×
                </button>
            )}
        </div>
    )
}
