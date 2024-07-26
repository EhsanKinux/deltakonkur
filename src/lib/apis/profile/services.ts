import { fetchInstance } from "../fetch-config";

export const get_counting_students = () => fetchInstance(`api/register/student-advisors/count`, { method: "GET" });
