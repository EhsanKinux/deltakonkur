import { fetchInstance } from "../fetch-config";
import { IPostStudentAssessment } from "./interface";

export const get_students_by_name = ({ first_name, last_name }: { first_name: string; last_name: string }) =>
  fetchInstance(
    `api/register/students/?first_name=${encodeURIComponent(first_name)}&last_name=${encodeURIComponent(last_name)}`,
    { method: "GET" }
  );

export const get_students_by_day = ({ solar_date_day }: { solar_date_day: string }) =>
  fetchInstance(`api/register/students/?solar_date_day=${solar_date_day}`, { method: "GET" });

export const post_student_assassment = (body: IPostStudentAssessment) =>
  fetchInstance(`api/register/assessment/`, { method: "POST", body: JSON.stringify(body) });

export const get_students_assassments = () => fetchInstance(`api/register/assessment/`, { method: "GET" });
