import { fetchInstance } from "../fetch-config";
import { ISubmitStudentRegisterService } from "../reserve/interface";
import { ISetStudentAdvisor } from "./interface";

export const get_registered_students = () => fetchInstance(`api/register/students`);

export const students_delete = ({ studentId }: { studentId: string }) =>
  fetchInstance(`api/register/students/${studentId}/`, { method: "DELETE" });

export const get_student_info = ({ studentId }: { studentId: string }) =>
  fetchInstance(`api/register/students/${studentId}/`, { method: "GET" });

export const update_student_info = ({
  studentId,
  ...body
}: {
  studentId: string;
  body: ISubmitStudentRegisterService;
}) => fetchInstance(`api/register/students/${studentId}/`, { method: "PATCH", body: JSON.stringify(body) });

export const set_student_advisor = ({ ...body }: { body: ISetStudentAdvisor }) =>
  fetchInstance(`api/register/student-advisors/`, { method: "POST", body: JSON.stringify(body) });
