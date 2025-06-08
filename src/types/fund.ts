// src/types/funds.ts
type FundMeta = {
  fund_house: string,
  scheme_type: string,
  scheme_category: string,
  scheme_code: number,
  scheme_name: string,
  isin_growth: boolean | null,
  isin_div_reinvestment: boolean | null
};

type FundData = {
  date: string,
  nav: string
};

export interface FundDetails {
  meta: FundMeta;
  data: FundData[];
  status: string;
};
