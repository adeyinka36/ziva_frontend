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
    // Do nothing if the auth state is not yet determined
    if (isAuthenticated === undefined) return;

    // Build the current route from segments (e.g., "/login", "/home", "/profile", etc.)
    const currentRoute = "/" + segments.join("/");

    // Define public routes that should only be accessible when NOT authenticated
    const publicRoutes = ["/login", "/register"];
    

    // If not authenticated and trying to access a protected route, redirect to login
    if (!isAuthenticated && !publicRoutes.includes(currentRoute)) {
      router.replace("/login");
      return;
    }

    // If authenticated and trying to access a public route, redirect to home (or any default authenticated route)
    if (isAuthenticated && publicRoutes.includes(currentRoute)) {
      router.replace("/home");
      return;
    }
  }, [isAuthenticated, segments, router]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  );
}
