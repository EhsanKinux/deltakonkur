import { IUserDetail } from "@/components/pages/dashboard/dashboardPages/management/users/userDetail/interface";
import { fetchInstance } from "../fetch-config";
import { ISubmitUserRegisteration, RoleChangeParams } from "./interface";

export const get_all_users = () =>
  fetchInstance(`api/auth/users/`, { method: "GET" });

export const submit_user_register_form = (body: ISubmitUserRegisteration) =>
  fetchInstance(`api/auth/users/`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const submit_user_roles = ({ userId, body }: RoleChangeParams) =>
  fetchInstance(`api/auth/role/add/${userId}/`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const remove_user_roles = ({ userId, body }: RoleChangeParams) =>
  fetchInstance(`api/auth/role/remove/${userId}/`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const delete_user = (userId: string) =>
  fetchInstance(`api/auth/users/${userId}`, { method: "DELETE" });

export const get_user_info = (userId: string) =>
  fetchInstance(`api/auth/users/${userId}/`, { method: "GET" });

export const update_user_info = (body: IUserDetail) =>
  fetchInstance(`api/auth/users/${body.id}/`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
