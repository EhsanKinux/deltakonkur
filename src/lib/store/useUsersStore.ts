import { IUsers } from "@/components/pages/dashboard/dashboardPages/users/users/interface";
import { create } from "zustand";

interface UserState {
  users: IUsers[];
  setUsers: (users: IUsers[]) => void;
  deleteUser: (id: string) => void;
}

export const useUsersStore = create<UserState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}));
