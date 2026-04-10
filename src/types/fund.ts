// src/types/fund.ts
type FundMeta = {
  fund_house: string,
  scheme_type: string,
  scheme_category: string,
  scheme_code: number,
  scheme_name: string,
  isin_growth: string | null,
  isin_div_reinvestment: string | null
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
