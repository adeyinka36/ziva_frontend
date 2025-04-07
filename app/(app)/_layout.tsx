import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native";
import { DocumentPlusIcon, BanknotesIcon, ClipboardDocumentListIcon, HomeIcon} from "react-native-heroicons/outline";
import HomeSectionHeader from "@/components/homeSectionHeader";
import { CubeTransparentIcon } from "react-native-heroicons/mini";

export default function AppLayout() {
  // Local state to hold the resolved game

  return (
   
      <SafeAreaView style={{ flex: 1 }} className="bg-primary">
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#777",
            tabBarInactiveTintColor: "#4e2b00",
            tabBarStyle: {
              backgroundColor: "#ffc75f",
              paddingBottom: 0,
              marginBottom: 0,
              borderColor: "#ffc75f",
              borderTopWidth: 0,
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
            name="topics"
            options={{
              tabBarLabel: "Topics", // pages will include custom and created topics options
              tabBarIcon: ({ color, size }) => (
                <ClipboardDocumentListIcon color={color} size={size} />
              ),
              header: () => <HomeSectionHeader />,
            }}
          />
    
      <Tabs.Screen
        name="sponsored"
        options={{
          tabBarLabel: "Sponsors",
          tabBarIcon: ({ color, size }) => (
            <BanknotesIcon color={color} size={size} />
          ),
          header: () => <HomeSectionHeader />,
        }}
      />
        
        </Tabs>
      </SafeAreaView>
  );
}
