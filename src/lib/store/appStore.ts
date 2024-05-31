import { create } from "zustand";

type FormData = {
  id: string;
  name: string;
  lastName: string;
  school: string;
  cellphone: string;
  tellphone: string;
  parentsPhone: string;
  major: string;
  grade: string;
};

type FormStore = {
  formData: FormData[];
  addFormData: (data: FormData) => void;
};

export const appStore = create<FormStore>((set) => ({
  formData: [],
  addFormData: (data: FormData) => set((state) => ({ formData: [...state.formData, data] })),
}));
