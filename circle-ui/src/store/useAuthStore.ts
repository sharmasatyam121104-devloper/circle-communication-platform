import { create } from "zustand";

import api from "../lib/api";

interface UserInterface {
    data: {
    _id: string;
    fullname: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    last_login: Date;
    profile_picture_url: string;
    }
}



interface AuthStore {
    user: UserInterface | null;
    loading: boolean;
    getMe: () => Promise<void>;
    setUser: (user: UserInterface | null) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    loading: true,
    getMe: async () => {
        set({ loading: true,});
        try {
            const { data } = await api.get<UserInterface>("/user/get-me");
            set({user: data});
        } 
        catch{
            set({user: null,});
        } 
        finally {
            set({loading: false,});
        }
    },

    setUser: (user) => set({ user }), 
}));

export default useAuthStore;