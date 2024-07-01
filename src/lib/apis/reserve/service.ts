import { fetchInstance } from "../fetch-config";
import { IRegisterStudentService } from "./interface";

export const submit_student_register_service = ({ ...body }: IRegisterStudentService) =>
  fetchInstance(`api/register/students/`, { method: "POST", body: JSON.stringify(body) });

