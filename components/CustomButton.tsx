import {Text, TouchableOpacity} from "react-native";
import React from "react";



export default function CustomButton({text, onClick, disabled, loading, className}) {
    return (
        <TouchableOpacity onPress={handleSubmit(onLogin)} className="bg-black p-4 rounded-lg mt-6">
            <Text className="text-primary text-center font-semibold min-w-full">LOGIN</Text>
        </TouchableOpacity>
    );
}