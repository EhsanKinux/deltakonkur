import { fetchInstance } from "../fetch-config";
import { IContent } from "./interface";

export const send_content = (body: IContent[]) =>
  fetchInstance(`api/content/contents/`, { method: "POST", body: JSON.stringify(body) });
