import { fetchInstance } from "../fetch-config";
import { ISubmitUserRegisteration } from "./interface";

export const get_all_users = () => fetchInstance(`api/auth/users/`, { method: "GET" });

export const submit_user_register_form = (body: ISubmitUserRegisteration) =>
  fetchInstance(`api/auth/users/`, { method: "POST", body: JSON.stringify(body) });
