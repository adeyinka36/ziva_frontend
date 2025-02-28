import "../global.css";
import {Slot} from "expo-router";
import {SafeAreaView} from "react-native";
import {useEffect} from "react";
import {useAuth} from "@/contexts/auth";
import {useRouter, useSegments} from "expo-router";
import {AuthContextProvider} from "@/contexts/auth";


const MainLayout = () => {
    const {isAuthenticated} = useAuth();
    const segments = useSegments();
    const router = useRouter();
    useEffect(() => {
        if(typeof isAuthenticated == undefined) return;
        const inApp = segments[0] =='(app)';
        if(isAuthenticated && !inApp) {
            router.replace("/");
        } else if(!isAuthenticated){
            router.replace("/login");
            // router.replace("/Home")
        }

    }, [isAuthenticated])

  return (
        <SafeAreaView className="bg-primary flex-1 justify-center items-center">
          <Slot />
        </SafeAreaView>
  );
}

export default function RootLayout() {
    return (
            <AuthContextProvider>
                <MainLayout/>
            </AuthContextProvider>
    )
}