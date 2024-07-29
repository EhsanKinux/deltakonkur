import { fetchInstance } from "../fetch-config";
import { ISubmitAdvisorRegisterService } from "./interface";

export const get_registered_advisors = () => fetchInstance(`api/advisor/advisors/`, { method: "GET" });

export const submit_advisors_register_service = ({ ...body }: ISubmitAdvisorRegisterService) => {
  return fetchInstance(`api/advisor/advisors/`, { method: "POST", body: JSON.stringify(body) });
};

export const advisors_delete = ({ advisorId }: { advisorId: string }) =>
  fetchInstance(`api/advisor/advisors/${advisorId}/`, { method: "DELETE" });

export const advisor_update = (body: ISubmitAdvisorRegisterService) =>
  fetchInstance(`api/advisor/advisors/${body.id}/`, { method: "PATCH", body: JSON.stringify(body) });

export const get_advisor_info = ({ advisorId }: { advisorId: string }) =>
  fetchInstance(`api/advisor/advisors/${advisorId}/`, { method: "GET" });

export const advisor_students = () => fetchInstance(`api/register/student-advisors/`, { method: "GET" });

export const get_student_of_advisor = ({ advisorId }: { advisorId: string }) =>
  fetchInstance(`api/register/advisor/students/${advisorId}/`, { method: "GET" });

export const get_students_of_each_advisor = ({ advisorId }: { advisorId: string }) =>
  fetchInstance(`api/register/calculate-wage/${advisorId}/`, { method: "GET" });

export const get_wage_of_advisor = ({ advisorId }: { advisorId: string }) =>
  fetchInstance(`api/register/calculate-wage/${advisorId}/`, { method: "GET" });
