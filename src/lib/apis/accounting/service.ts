import { fetchInstance } from "../fetch-config";
import { IRestartStudent, IStopStudent } from "./interface";

export const get_all_students = () => fetchInstance(`api/register/students/`, { method: "GET" });

export const get_exel_info = () => fetchInstance(`api/register/accountant/`, { method: "GET" });

export const get_exel_info_test = () => fetchInstance(`api/register/test-accountant/`, { method: "GET" });

export const get_all_advisors = () => fetchInstance(`api/advisor/advisors/`, { method: "GET" });

export const get_students_with_advisors = () => fetchInstance(`api/register/student-advisors/`, { method: "GET" });

export const stop_student_advisor = (body: IStopStudent) =>
  fetchInstance(`api/register/student-advisors/${body.id}/`, { method: "PATCH", body: JSON.stringify(body) });

export const reset_student = (body: IRestartStudent) =>
  fetchInstance(`api/register/student-advisors/restart/${body.student}/`, {
    method: "POST",
    body: JSON.stringify(body),
  });
