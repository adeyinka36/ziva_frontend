import "../global.css";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { useRouter, useSegments } from "expo-router";
import { AuthContextProvider } from "@/contexts/auth";

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // Check directly if isAuthenticated is undefined
        if (isAuthenticated === undefined) return;
        const inApp = segments[0] === "(app)";
        if (isAuthenticated && !inApp) {
            router.replace("/home");
        } else if (!isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated, segments, router]);

    return (
            <Slot />
    );
};

export default function RootLayout() {
    return (
        <AuthContextProvider>
            <MainLayout />
        </AuthContextProvider>
    );
}
