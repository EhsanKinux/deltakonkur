import { fetchInstance } from "../fetch-config";
import { ISubmitAdvisorRegisterService } from "./interface";

export const get_registered_advisors = () => fetchInstance(`api/advisor/advisors/`);

export const submit_advisors_register_service = ({ ...body }: ISubmitAdvisorRegisterService) => {
  fetchInstance(`api/advisor/advisors/`, { method: "POST", body: JSON.stringify(body) });
};
