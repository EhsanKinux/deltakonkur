import { create } from "zustand";
import { IAccountStore, IallStudents } from "./types";
import { convertToShamsi } from "../utils/date/convertDate";

export const accountingStore = create<IAccountStore>((set) => ({
  allstudents: [],

  setAllstudents: (students: IallStudents[]) => set({ allstudents: students }),

  addAllstudents: (student: IallStudents) => {
    const convertedData = {
      ...student,
      created: student.created ? convertToShamsi(student.created) : student.created,
    };

    set((state) => {
      if (!state.allstudents.some((student) => student.id === convertedData.id)) {
        return { allstudents: [...state.allstudents, convertedData] };
      } else {
        return state;
      }
    });
  },

  deleteStudent: (studentId) =>
    set((state) => ({
      allstudents: state.allstudents.filter((student) => student.id !== studentId),
    })),
}));
