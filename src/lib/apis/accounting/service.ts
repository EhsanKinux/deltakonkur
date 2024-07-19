import { fetchInstance } from "../fetch-config";

export const get_all_students = () => fetchInstance(`api/register/students/`, { method: "GET" });

export const get_exel_info = () => fetchInstance(`api/register/accountant/`, { method: "GET" });

export const get_exel_info_test = () => fetchInstance(`api/register/test-accountant/`, { method: "GET" });
