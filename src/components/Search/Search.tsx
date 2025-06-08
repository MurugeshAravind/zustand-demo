// src/components/SearchBox.tsx
import React, { useEffect } from "react";
import { useSchemeDetailsStore } from "../../store/useSchemeDetailsStore";
import Card from "../Card/Card";
import type { SchemeDetails } from "../../types/scheme";
import Loader from "../Loader/Loader";

const SearchBox: React.FC = () => {
  const { query, setQuery, scheme, fetchSchemeDetails, loading } =
    useSchemeDetailsStore();

  useEffect(() => {
    let timer = 0;
    if (query.length > 0) {
      timer = setTimeout(() => {
        fetchSchemeDetails(query);
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [query, fetchSchemeDetails]);

  return (
    <>
      <div className="flex items-center justify-center w-full mt-[50px] mb-[50px]">
        <input
          type="text"
          className="text-center w-[80%] sm:w-1/2 md:w-1/2 lg:w-1/2 p-[5px] border border-grey-500"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Enter any fund name"
        />
        <button
          className="absolute ml-[50%] md:ml-[45%] sm:ml-[45%] xs:ml-[50%]"
          onClick={() => {
            if (query?.trim()?.length > 0) {
              setQuery("");
              fetchSchemeDetails("");
            }
          }}
        >
          ❌
        </button>
      </div>
      {loading ? (
        <Loader color="grey" size={80} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {scheme.map((item: SchemeDetails, index: number) => (
            <Card
              key={`${item.schemeCode}_${index}`}
              schemeCode={item.schemeCode}
              schemeName={item.schemeName}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default SearchBox;
