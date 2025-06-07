import { useEffect } from "react";
import { useFundDetailsStore } from "../../store/useFundDetailsStore";

const CardDetails = ({ id }: { id: number }): React.JSX.Element => {
  const { fund, fetchFundDetails, loading } = useFundDetailsStore();
  useEffect(() => {
    fetchFundDetails(id);
  }, [id, fetchFundDetails]);
  return (
    <div >
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div>
          <p>Scheme Code: {fund?.meta?.scheme_code ?? "N/A"}</p>
          <p>Scheme Name: {fund?.meta?.scheme_name ?? "N/A"}</p>
          <p>Fund House: {fund?.meta?.fund_house ?? "N/A"}</p>{" "}
          <p>Scheme Category: {fund?.meta?.scheme_category ?? "N/A"}</p>
          <p>Scheme Type: {fund?.meta?.scheme_type ?? "N/A"}</p>{" "}
        </div>
      )}
    </div>
  );
};

export default CardDetails;
