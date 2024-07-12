import { fetchInstance } from "../fetch-config";

export const get_all_students = () => fetchInstance(`api/register/students/`, { method: "GET" });
