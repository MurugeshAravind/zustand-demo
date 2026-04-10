import { useEffect } from "react";
import { useFundDetailsStore } from "../../store/useFundDetailsStore";

const SKELETON_WIDTHS = ["75%", "60%", "85%", "50%", "65%"];

const CardDetails = ({ id }: { id: number }) => {
  const fund = useFundDetailsStore((s) => s.funds[id]);
  const isLoading = useFundDetailsStore((s) => s.loading[id]);
  const error = useFundDetailsStore((s) => s.errors[id]);
  const fetchFundDetails = useFundDetailsStore((s) => s.fetchFundDetails);

  useEffect(() => {
    fetchFundDetails(id);
  }, [id, fetchFundDetails]);

  if (isLoading) {
    return (
      <div
        className="space-y-3"
        role="status"
        aria-label="Loading fund details"
      >
        {SKELETON_WIDTHS.map((w, i) => (
          <div
            key={i}
            className="h-3 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse"
            style={{ width: w }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500 dark:text-red-400">{error}</p>;
  }

  if (!fund) return null;

  const latestNav = fund.data?.[0];

  return (
    <div className="space-y-3">
      {/* NAV Highlight */}
      {latestNav?.nav && (
        <div className="flex items-baseline justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/15">
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            NAV
          </span>
          <div className="text-right">
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300 font-mono">
              {`\u20B9${latestNav.nav}`}
            </span>
            {latestNav.date && (
              <p className="text-xs text-emerald-500/70 dark:text-emerald-400/50 mt-0.5">
                {latestNav.date}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Details */}
      <dl className="space-y-2.5">
        {[
          { label: "Fund House", value: fund.meta.fund_house },
          { label: "Category", value: fund.meta.scheme_category },
          { label: "Type", value: fund.meta.scheme_type },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <dt className="text-slate-400 dark:text-slate-500 shrink-0 text-xs uppercase tracking-wide">
              {label}
            </dt>
            <dd className="text-right font-medium text-slate-700 dark:text-slate-300 text-xs">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default CardDetails;
