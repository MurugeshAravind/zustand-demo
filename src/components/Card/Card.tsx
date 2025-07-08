import React from "react";
import type { SchemeDetails } from "../../types/scheme";
import CardDetails from "./CardDetails";

const Card = ({ schemeCode, schemeName }: SchemeDetails): React.JSX.Element => {
  const [showDetails, setShowDetails] = React.useState(false);
  const handleClick = () => {
    setShowDetails(!showDetails);
  };
  return (
    <div className="text-center mt-2 border border-teal-500 p-4 rounded shadow-md min-h-[250px] flex flex-col justify-between">
      {showDetails ? (
        <CardDetails id={schemeCode} />
      ) : (
        <>
          <h2 className="text-lg font-semibold">{schemeName}</h2>
          <img className="w-full h-auto" src="./mf.png" alt="fund" />
        </>
      )}
      <button className="font-bold text-teal-600" onClick={handleClick}>
        {!showDetails ? "Show Fund Details" : "Hide Fund Details"}
      </button>
    </div>
  );
};

export default React.memo(Card);
