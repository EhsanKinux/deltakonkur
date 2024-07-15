import { fetchInstance } from "../fetch-config";

export const get_students_by_name = ({ first_name, last_name }: { first_name: string; last_name: string }) =>
  fetchInstance(
    `api/register/students/?first_name=${encodeURIComponent(first_name)}&last_name=${encodeURIComponent(last_name)}`,
    { method: "GET" }
  );
