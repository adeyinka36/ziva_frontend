import { createContext, useEffect, useState, useContext, ReactNode } from "react";
import { AuthContextType, defaultAuthContext } from "@/types/auth";
import axios from "axios";
import {BASE_URL} from "@/utils/getUrls";
import {removeToken, storeToken, getToken} from "@/utils/auth";
import { userType } from "@/types/userType";
import { PlayerType } from "@/functions/getPlayers";


const AuthContext = createContext<AuthContextType>(defaultAuthContext);
interface AuthProviderProps {
    children: ReactNode;
}

const setDefaultAuthHeaders = (token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const AuthContextProvider = ({children}: AuthProviderProps) => {

    const [user, setUser] = useState<PlayerType>({
        first_name: "",
        last_name: "",
        email: "",
        zivas: 0,
        id: "",
        username: "",
        is_member: false,
        avatar: ""
    });
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authToken, setAuthToken] = useState<string|null>(null);


    const removeTokenAndUser = async () => {
        setAuthToken("");
        setIsAuthenticated(false);
        await removeToken();
    }
    const storeTokenAndSetUser = async (token: string, user: any) => {
        await storeToken(token);
        setIsAuthenticated(true);
        setAuthToken(token);
        setUser(user);
        setDefaultAuthHeaders(token);
    }


    useEffect( ()=> {
        const loadToken = async () => {
            const token = await getToken();
            if(token){
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthToken(token)
            }
        }
        loadToken().then();
    }, [])

    const AuthContextValues:AuthContextType = {
        user,
        isAuthenticated,
        authToken,
        setUser: (updatedUser: any) => {
            setUser(updatedUser);
        },
        login: async (email: string, password: string): Promise<boolean> => {
            try{
                const response = await axios.post(`${BASE_URL}/players/login`,{email, password});
                console.log(response.data)
                await storeTokenAndSetUser(response.data.token, response.data.data);
                return true;
            }catch (error: any){
                await removeTokenAndUser();
                return false;
            }
        },
        register: async (firstName, lastName, email, password, confirmPassword, username    ): Promise<boolean> => {
            try{
                const response = await axios.post(`${BASE_URL}/players/register`,{
                    email,
                    password,
                    confirm_password: confirmPassword,
                    username,
                    first_name: firstName,
                    last_name: lastName
                });

                await storeTokenAndSetUser(response.data.token, response.data.data);
                return true;
            }catch (error){
                await removeTokenAndUser();
                return false;
            }
        },
        logout: async () => {
            await removeTokenAndUser();
        },

        requestPasswordResetToken: async (firstName: string, lastName: string, email: string) => {
            try{
                 await axios.post(`${BASE_URL}/players/request-password-reset-token`, {
                    first_name: firstName,
                    last_name: lastName,
                    email,
                });
                return {
                    error: null,
                    status: "success"
                }
            }catch (error){
                if (axios.isAxiosError(error) && error.response) {
                    return { error: error.response.data.error };
                } else {
                    return { status: "failure", error: "An unexpected error occurred" };
                }
            }
        },
        sendPasswordResetToken: async (token: string, password: string, confirmPassword: string) => {
            try{
                await axios.post(`${BASE_URL}/players/reset-password`, {
                    token,
                    password,
                    confirm_password: confirmPassword,
                });
                return {
                    success: true,
                    error: null
                }
            }catch (error: any){
                if (axios.isAxiosError(error) && error.response) {
                    return { error: error.response.data.error };
                } else {
                    return { success: false, error: "An unexpected error occurred" };
                }
            }
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