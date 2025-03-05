import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native";
import { HomeIcon, ClipboardDocumentListIcon } from "react-native-heroicons/outline";
import HomeHeader from "@/components/homeHeader";
import { CubeTransparentIcon } from "react-native-heroicons/mini";

export default function AppLayout() {
    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-primary">
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#000",
                    tabBarInactiveTintColor: "#000",
                    tabBarStyle: { backgroundColor: "#ffc75f" },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarLabel: "Home",
                        tabBarIcon: ({ color, size }) => (
                            <HomeIcon color={color} size={size} />
                        ),
                        header: () => <HomeHeader />,
                    }}
                />
                <Tabs.Screen
                    name="createdGames"
                    options={{
                        tabBarLabel: "Created Games",
                        tabBarIcon: ({ color, size }) => (
                            <CubeTransparentIcon color={color} size={size} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="customQuizzes"
                    options={{
                        tabBarLabel: "Custom Quizzes",
                        tabBarIcon: ({ color, size }) => (
                            <ClipboardDocumentListIcon color={color} size={size} />
                        ),
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}
