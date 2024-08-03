import { fetchInstance } from "../fetch-config";
import { CancelStudentParams } from "./interface";

export const cancel_student = ({ studentId, body }: CancelStudentParams) =>
  fetchInstance(`api/register/student-advisors/${studentId}/cancel/`, { method: "POST", body: JSON.stringify(body) });

export const check_student_is_active = ({ studentId }: { studentId: string }) =>
  fetchInstance(`api/register/active-student-advisor/${studentId}/`, { method: "GET" });
