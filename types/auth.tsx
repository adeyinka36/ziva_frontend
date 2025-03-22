import { SetStateAction } from "react";
import { Dispatch } from "react";
import { userType } from "./userType";

// AuthContextType.ts
export interface AuthContextType {
    user: userType;
    isAuthenticated: boolean;
    authToken: string | null;

    login: (email: string, password: string) => Promise<boolean>;
    setUser: (updatedUser: any) => void;
    register: (firstName: string, lastName: string, email: string, password: string, confirmPassword: string, username: string) => Promise<boolean>;
    logout: () => Promise<void>;
    requestPasswordResetToken: (firstName: string, lastName: string, email: string) => Promise<any>;
    sendPasswordResetToken: (token: string, password: string, confirmPassword: string) => Promise<any>;
}

export const defaultAuthContext: AuthContextType = {
    user: {
        first_name: "",
        last_name: "",
        email: "",
        zivas: 0,
        id: "",
        username: "",
        avatar: "",
        is_member: false
    },
    isAuthenticated: false,
    authToken: null,

    setUser:  (updatedUser: any) : void =>{

    },
    login: async (email: string, password: string): Promise<boolean> => {
        return false;
    },
    register: async (
        email: string,
        password: string,
        confirmPassword: string,
        username: string
    ): Promise<boolean> => {
       return false;
    },
    logout: async (): Promise<void> => {

    },
    requestPasswordResetToken: async (firstName: string, lastName: string, email: string): Promise<any> => {
        console.log("Default requestPasswordResetToken function called with:", firstName, lastName, email);
    },
    sendPasswordResetToken: async (token: string, password: string, confirmPassword: string): Promise<any> => {
        console.log("Default sendPasswordResetToken function called with:");
    },
};
