import { create } from "zustand";
import { IAccountStore, IallAdvisors, IallStudents } from "./types";
import { convertToShamsi } from "../utils/date/convertDate";

export const accountingStore = create<IAccountStore>((set) => ({
  allstudents: [],
  alladvisors: [],

  setAllstudents: (students: IallStudents[]) => set({ allstudents: students }),
  setAlladvisors: (advisors: IallAdvisors[]) => set({ alladvisors: advisors }),

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

  addAlladvisors: (advisor: IallAdvisors) =>
    set((state) => {
      const advisorExists = state.alladvisors.some((existingAdvisor) => existingAdvisor.id === advisor.id);
      if (!advisorExists) {
        const updatedAdvisors = [...state.alladvisors, advisor];
        return { alladvisors: updatedAdvisors };
      }
      return state;
    }),

  deleteStudent: (studentId) =>
    set((state) => ({
      allstudents: state.allstudents.filter((student) => student.id !== studentId),
    })),
}));
