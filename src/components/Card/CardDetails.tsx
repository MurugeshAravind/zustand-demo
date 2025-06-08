import { useEffect } from "react";
import { useFundDetailsStore } from "../../store/useFundDetailsStore";
import Loader from "../Loader/Loader";

const CardDetails = ({ id }: { id: number }): React.JSX.Element => {
  const { funds, fetchFundDetails, loading } = useFundDetailsStore();
  const fund = funds[id];

  useEffect(() => {
    fetchFundDetails(id);
  }, [id, fetchFundDetails]);

  return (
    <>
      {loading && !fund ? (
        <Loader color="teal" size={40} />
      ) : (
        fund && (
          <div className="mb-[20px]">
            <p><span className="font-bold text-teal-500">Scheme Code:</span> {fund?.meta?.scheme_code}</p>
            <p><span className="font-bold text-teal-500">Scheme Name:</span> {fund?.meta?.scheme_name}</p>
            <p><span className="font-bold text-teal-500">Fund House:</span> {fund?.meta?.fund_house}</p>
            <p><span className="font-bold text-teal-500">Scheme Category:</span> {fund?.meta?.scheme_category}</p>
            <p><span className="font-bold text-teal-500">Scheme Type:</span> {fund?.meta?.scheme_type}</p>
            <p><span className="font-bold text-teal-500">NAV:</span> {fund?.data[0].nav}</p>
          </div>
        )
      )}
    </>
  );
};

export default CardDetails;
