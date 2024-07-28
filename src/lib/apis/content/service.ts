import { fetchInstance } from "../fetch-config";
import { IContent, IDelivered } from "./interface";

export const send_content = (body: IContent[]) =>
  fetchInstance(`api/content/contents/`, { method: "POST", body: JSON.stringify(body) });

export const get_advisor_content = (advisorId: string) =>
  fetchInstance(`api/content/advisor-contents/${advisorId}/`, { method: "GET" });

export const send_content_delivered = ({ body }: { body: IDelivered }) =>
  fetchInstance(`api/content/contents/partial_edit/${body.id}/`, { method: "PATCH", body: JSON.stringify(body) });
