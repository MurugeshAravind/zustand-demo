import { useEffect, useRef } from "react";
import { useSchemeDetailsStore } from "../../store/useSchemeDetailsStore";
import Card from "../Card/Card";

const MAX_DISPLAY = 50;
const POPULAR_SEARCHES = ["HDFC", "SBI", "Axis", "ICICI", "Tata", "Nippon"];

const SearchBox: React.FC = () => {
  const { query, setQuery, schemes, fetchSchemes, loading, error } =
    useSchemeDetailsStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSchemes(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, fetchSchemes]);

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const displayed = schemes.slice(0, MAX_DISPLAY);

  return (
    <div>
      {/* Search Input */}
      <div className="relative max-w-2xl mx-auto">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all duration-200 shadow-sm hover:shadow-md text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mutual fund schemes..."
          aria-label="Search mutual fund schemes"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Results Area */}
      <div className="mt-10">
        {/* Error State */}
        {error && (
          <div className="text-center py-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 mb-4">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-slate-600 dark:text-slate-400">{error}</p>
            <button
              onClick={() => fetchSchemes(query)}
              className="mt-4 px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && !error && (
          <>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">
              Searching...
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 animate-pulse"
                >
                  <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                  <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-lg mt-2.5" />
                  <div className="h-8 w-28 bg-slate-100 dark:bg-slate-800 rounded-lg mt-8" />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Results */}
        {!loading && !error && schemes.length > 0 && (
          <>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">
              {schemes.length > MAX_DISPLAY
                ? `Showing ${MAX_DISPLAY} of ${schemes.length.toLocaleString()} schemes \u2014 refine your search for better results`
                : `${schemes.length} scheme${schemes.length !== 1 ? "s" : ""} found`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {displayed.map((item, index) => (
                <div
                  key={item.schemeCode}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${Math.min(index * 30, 300)}ms`,
                  }}
                >
                  <Card
                    schemeCode={item.schemeCode}
                    schemeName={item.schemeName}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty — no results for query */}
        {!loading && !error && query.trim() && schemes.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
              <svg
                className="w-7 h-7 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-semibold">
              No schemes found
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              Try a different search term
            </p>
          </div>
        )}

        {/* Initial — no query yet */}
        {!loading && !error && !query.trim() && schemes.length === 0 && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 mb-4">
              <svg
                className="w-7 h-7 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-semibold">
              Start searching
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 mb-5">
              Type a fund name or try a popular search
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-1.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
