import { createContext, useEffect, useState, useContext } from "react";
import { AuthContextType, defaultAuthContext } from "@/types/auth";


const AuthContext = createContext<AuthContextType>(defaultAuthContext);
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContextProvider = ({children}: AuthProviderProps) => {

    useEffect( ()=> {
        const loadToken = async () => {
            const token = await getToken();
            if(token){
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthToken(token)
            }
        }
        loadToken();
    }, [])

    const AuthContextValues:AuthContextType = {
        user: null,
        isAuthenticated: false,
        authToken: null,
        setUser: (updatedUser: any) => {
            console.log("Setting user:", updatedUser);
        },
        login: async (email: string, password: string) => {
            console.log("Logging in with:", email, password);
        },
        register: async (email: string, password: string, confirmPassword: string, username: string) => {
            console.log("Registering with:", email, password, confirmPassword, username);
        },
        logout: async () => {
            console.log("Logging out");
        }
    }

    return(
        <AuthContext.Provider value={AuthContextValues}>
            {children}
        </AuthContext.Provider>
    )
}



export const useAuth = () => {
    const value  = useContext(AuthContext);


    if(!value) {
        throw new Error('useAuth must be used inside an AuthContextProvider');
    }

    return value;
}