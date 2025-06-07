import React from "react";
import type { SchemeDetails } from "../../types/scheme";
import CardDetails from "./CardDetails";

const Card = ({ schemeCode, schemeName }: SchemeDetails): React.JSX.Element => {
  const [showDetails, setShowDetails] = React.useState(false);
  const handleClick = () => {
    setShowDetails(!showDetails);
  };
  return (
    <div className="text-center mt-[10px] border border-teal-500">
      <h2 className="text-lg font-semibold mb-2">{schemeCode}</h2>
      <p>{schemeName}</p>
      <span className="font-bold text-grey-100" onClick={handleClick}>
        {!showDetails ? "Show Fund Details" : "Hide Fund Details"}
      </span>
      {showDetails ? <CardDetails id={schemeCode} /> : null}
    </div>
  );
};

export default Card;
