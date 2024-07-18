import { fetchInstance } from "../fetch-config";

export const get_all_users = () => fetchInstance(`api/auth/users/`, { method: "GET" });
