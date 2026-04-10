import { memo, useState } from "react";
import type { SchemeDetails } from "../../types/scheme";
import CardDetails from "./CardDetails";

const Card = ({ schemeCode, schemeName }: SchemeDetails) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`group rounded-2xl border bg-white dark:bg-slate-900 p-5 transition-all duration-200 flex flex-col ${
        expanded
          ? "border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-500/5"
          : "border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <h3 className="text-sm font-semibold leading-snug line-clamp-2">
        {schemeName}
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono">
        #{schemeCode}
      </p>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
          <CardDetails id={schemeCode} />
        </div>
      )}

      <div className="mt-auto pt-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
            expanded
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
          }`}
        >
          {expanded ? "Hide Details" : "View Details"}
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default memo(Card);
