import { SetStateAction } from "react";
import { Dispatch } from "react";

// AuthContextType.ts
export interface AuthContextType {
    user: any | null;
    isAuthenticated: boolean;
    authToken: string | null;

    login: (email: string, password: string) => Promise<void>;
    setUser: (updatedUser: any) => void;
    register: (firstName: string, lastName: string, email: string, password: string, confirmPassword: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
    requestPasswordResetToken: (firstName: string, lastName: string, email: string) => Promise<any>;
    sendPasswordResetToken: (token: string, password: string, confirmPassword: string) => Promise<any>;
}

export const defaultAuthContext: AuthContextType = {
    user: null,
    isAuthenticated: false,
    authToken: null,

    setUser:  (updatedUser: any) : void =>{

    },
    login: async (email: string, password: string): Promise<void> => {
        console.log("Default login function called with:", email, password);
        // No operation by default
    },
    register: async (
        email: string,
        password: string,
        confirmPassword: string,
        username: string
    ): Promise<void> => {
        console.log("Default register function called with:", email, password, confirmPassword, username);
        // No operation by default
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
