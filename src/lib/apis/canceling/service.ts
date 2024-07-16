import { fetchInstance } from "../fetch-config";

export const cancel_student = ({ studentId }: { studentId: string }) =>
  fetchInstance(`api/register/student-advisors/${studentId}/`, { method: "DELETE" });

export const check_student_is_active = ({ studentId }: { studentId: string }) =>
  fetchInstance(`api/register/active-student-advisor/${studentId}/`, { method: "GET" });
