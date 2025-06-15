import { fetchInstance } from "../fetch-config";
import {
  IPostStudentAssessment,
  StudentCallAnsweringBody,
  StudentCallAnsweringBody2,
} from "./interface";

export const get_students_by_name = ({
  first_name,
  last_name,
}: {
  first_name: string;
  last_name: string;
}) => {
  let url = "api/register/students/?active=true&";

  // Add first name to the query string if it exists
  if (first_name) {
    url += `first_name=${encodeURIComponent(first_name)}`;
  }

  // Add last name to the query string if it exists, with & if needed
  if (last_name) {
    url += `${first_name ? "&" : ""}last_name=${encodeURIComponent(last_name)}`;
  }

  return fetchInstance(url, { method: "GET" });
};

export const get_students_by_day = ({
  solar_date_day,
}: {
  solar_date_day: string;
}) =>
  fetchInstance(`api/register/students/?solar_date_day=${solar_date_day}`, {
    method: "GET",
  });

export const post_student_assassment = (body: IPostStudentAssessment) =>
  fetchInstance(`api/supervisor/assessment/`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const get_students_assassments = () =>
  fetchInstance(`api/supervisor/assessment/`, { method: "GET" });

export const get_assessment_by_advisorId = (advisorId: string) =>
  fetchInstance(`api/supervisor/advisor/assessments/${advisorId}/`, {
    method: "GET",
  });

export const student_call_answering = (body: StudentCallAnsweringBody) =>
  fetchInstance(`api/supervisor/followups/${body.id}/`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const student_call_answering2 = (body: StudentCallAnsweringBody2) =>
  fetchInstance(`api/supervisor/followups/`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const get_not_completed_followup_students = () =>
  fetchInstance(`api/supervisor/followups/not-completed/list/`, {
    method: "GET",
  });

export const send_notification = (token: string) =>
  fetchInstance(`api/supervisor/followups/sendnotif/${token}/`, {
    method: "GET",
  });

export const followup_complete = (token: string, body: any) =>
  fetchInstance(`api/supervisor/followups/complete/${token}/`, {
    method: "POST",
    body: JSON.stringify(body),
  });
