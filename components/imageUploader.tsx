// imagePickerUtil.ts
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Platform, Alert } from "react-native";
import { BASE_URL } from "@/utils/getUrls";

/**
 * Opens the image library for the user to pick an image.
 * Returns the selected image URI, or null if no image is selected or permission is denied.
 */
export async function pickImageFromGallery(): Promise<string | null> {
  // Request permission to access the media library (only required on mobile)
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return null;
    }
  }

  try {
    // Launch the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // If the user didn't cancel, return the image URI
    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error("Error picking an image:", error);
    return null;
  }
}

export const handleImageSelectionAndUpload = async (userId: string) => {
    const imageUri = await pickImageFromGallery();

    if (!imageUri ) {
      return;
    }
  
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: "profile.jpg", 
      type: "image/jpeg",   
    } as any);
  
    try {
      const response = await axios.post(
        `${BASE_URL}/players/image-upload/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.data && response.data.data && response.data.data.url) {
        return (response.data.data.url);
      } else {
        console.error("Unexpected response format:", response.data);
        Alert.alert('Unable to upload image');
        return ""
      }
    } catch (error) {
        console.error("Error uploading image:", error);
        Alert.alert("Unable to upload image");
        return ""
  }
}
