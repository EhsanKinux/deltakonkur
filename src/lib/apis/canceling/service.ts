import { fetchInstance } from "../fetch-config";

export const cancel_student = ({ studentId }: { studentId: string }) =>
  fetchInstance(`api/register/student-advisors/${studentId}/`, { method: "DELETE" });
