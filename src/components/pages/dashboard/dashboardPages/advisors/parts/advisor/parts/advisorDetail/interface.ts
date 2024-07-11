import { FormEntry } from "../../../student/table/interfaces";

export interface ProcessedStudentData extends FormEntry {
    status: string | null;
    id: string;
    created: string;
  }
  
export interface StudentInformation {
    [key: string]: ProcessedStudentData | undefined;
  }
  
  