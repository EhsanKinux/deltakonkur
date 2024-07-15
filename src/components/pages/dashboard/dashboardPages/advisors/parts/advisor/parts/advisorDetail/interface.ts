import { FormEntry } from "../../../student/table/interfaces";

export interface ProcessedStudentData extends FormEntry {
    status: string | null;
    id: string;
    created: string;
    started_date: string;
    ended_date: string;
  }
  
export interface StudentInformation {
    [key: string]: ProcessedStudentData | undefined;
  }
  
  