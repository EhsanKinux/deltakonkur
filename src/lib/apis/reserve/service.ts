import { fetchInstance } from "../fetch-config";
import { ISubmitStudentRegisterService } from "./interface";

export const submit_student_register_service = ({ ...body }: ISubmitStudentRegisterService) =>
  fetchInstance(`api/register/students`, { method: "POST", body: JSON.stringify(body), mode: "no-cors" });
