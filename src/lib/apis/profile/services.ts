import { fetchInstance } from "../fetch-config";

export const get_counting_students = () => fetchInstance(`api/register/student-advisors/count/`, { method: "GET" });

export const get_all_students = () => fetchInstance(`api/register/students/`, { method: "GET" });
