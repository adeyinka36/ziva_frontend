import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreatedGames() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
            <View className="flex-1 justify-center items-center">
                <Text className="text-xl font-semibold">Created Games</Text>
            </View>
        </SafeAreaView>
    );
}
