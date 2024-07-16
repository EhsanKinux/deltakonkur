import { fetchInstance } from "../fetch-config";

export const get_students_by_name = ({ first_name, last_name }: { first_name: string; last_name: string }) =>
  fetchInstance(
    `api/register/students/?first_name=${encodeURIComponent(first_name)}&last_name=${encodeURIComponent(last_name)}`,
    { method: "GET" }
  );

export const get_students_by_day = ({ solar_date_day }: { solar_date_day: string }) =>
  fetchInstance(`api/register/student-advisors/?solar_date_day=${solar_date_day}`, { method: "GET" });
