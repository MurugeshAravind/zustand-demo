// src/components/SearchBox.tsx
import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useSchemeDetailsStore } from "../../store/useSchemeDetailsStore";
import Card from "../Card/Card";
import type { SchemeDetails } from "../../types/scheme";
import Loader from "../Loader/Loader";

const SearchBox: React.FC = () => {
  const { query, setQuery, scheme, fetchSchemeDetails, loading } =
    useSchemeDetailsStore();

  const timerRef = useRef<number | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (value === query) return;
      setQuery(value);
    },
    [setQuery, query]
  );

  const handleClear = useCallback(() => {
    if (query.trim().length > 0) {
      setQuery("");
      fetchSchemeDetails("");
    }
  }, [query, setQuery, fetchSchemeDetails]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.length > 0) {
      timerRef.current = setTimeout(() => {
        fetchSchemeDetails(query);
      }, 300);
    } else {
      setQuery("");
      fetchSchemeDetails("");
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, setQuery, fetchSchemeDetails]);

  const cardList = useMemo(
    () =>
      scheme.map((item: SchemeDetails, index: number) => (
        <Card
          key={`${item.schemeCode}_${index}`}
          schemeCode={item.schemeCode}
          schemeName={item.schemeName}
        />
      )),
    [scheme]
  );

  return (
    <>
      <div className="flex items-center justify-center w-full mt-[50px] mb-[50px]">
        <input
          type="text"
          className="text-center w-[80%] sm:w-1/2 md:w-1/2 lg:w-1/2 p-[5px] border border-grey-500"
          value={query}
          onChange={handleChange}
          placeholder="Enter any fund name"
        />
        <button
          className="absolute ml-[50%] md:ml-[45%] sm:ml-[45%] xs:ml-[50%]"
          onClick={handleClear}
        >
          ❌
        </button>
      </div>
      {loading ? (
        <Loader color="grey" size={80} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cardList}
        </div>
      )}
    </>
  );
};

export default SearchBox;
