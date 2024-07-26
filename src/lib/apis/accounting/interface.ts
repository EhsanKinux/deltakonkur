export interface IStopStudent {
  id: string;
  student: string;
  advisor: string;
  status: string;
  expire_date?: string;
  stop_date: string;
}

export interface IRestartStudent {
  id: string;
  student: string;
  advisor: string;
  status: string;
  solar_date_day: string;
  solar_date_month: string;
  solar_date_year: string;
  expire_date: string;
  stop_date: string;
}
