import { fetchInstance } from "../fetch-config";
import { ISubmitAdvisorRegisterService } from "./interface";

export const get_registered_advisors = () => fetchInstance(`api/advisor/advisors/`);

export const submit_advisors_register_service = ({ ...body }: ISubmitAdvisorRegisterService) => {
  return fetchInstance(`api/advisor/advisors/`, { method: "POST", body: JSON.stringify(body) });
};

export const advisors_delete = ({ advisorId }: { advisorId: string }) =>
  fetchInstance(`api/advisor/advisors/${advisorId}/`, { method: "DELETE" });

export const get_advisor_info = ({ advisorId }: { advisorId: string }) =>
  fetchInstance(`api/advisor/advisors/${advisorId}/`, { method: "GET" });
