import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {Link} from "expo-router";
import React from "react";

export default function CustomQuizzes() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
            <View className="flex-1 justify-center items-center">
                <Text className="text-xl font-semibold">Custom Quizzes</Text>
            </View>
            <Text className="mt-4 text-black">
                <Link href="/home" className="text-dark font-bold">
                    Back to Home
                </Link>
            </Text>
        </SafeAreaView>
    );
}
