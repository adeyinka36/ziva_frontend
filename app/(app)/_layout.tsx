import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native";
import { HomeIcon, ClipboardDocumentListIcon } from "react-native-heroicons/outline";
import HomeSectionHeader from "@/components/homeSectionHeader";
import { CubeTransparentIcon } from "react-native-heroicons/mini";

export default function AppLayout() {
    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-primary" >
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#777",
                    tabBarInactiveTintColor:"#4e2b00",
                    tabBarStyle: {
                        backgroundColor: "#ffc75f",
                        paddingBottom: 0,
                        marginBottom: 0,
                        borderColor: "#ffc75f",
                        borderTopWidth: 0,
                        boxShadow: "0px 0px 10px 0px #000000"
                    },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarLabel: "Home",
                        tabBarIcon: ({ color, size }) => (
                            <HomeIcon color={color} size={size} />
                        ),
                        header: () => <HomeSectionHeader />,
                    }}
                />
                <Tabs.Screen
                    name="createdGames"
                    options={{
                        tabBarLabel: "Created Games",
                        tabBarIcon: ({ color, size }) => (
                            <CubeTransparentIcon color={color} size={size} />
                        ),
                        header: () => <HomeSectionHeader />,
                    }}
                />
                <Tabs.Screen
                    name="customQuizzes"
                    options={{
                        tabBarLabel: "Custom Quizzes",
                        tabBarIcon: ({ color, size }) => (
                            <ClipboardDocumentListIcon color={color} size={size} />
                        ),
                        header: () => <HomeSectionHeader />,
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}
