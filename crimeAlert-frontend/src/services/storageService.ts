import {
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";
import { storage } from "./firebaseConfig";

/**
 * Upload an image to Firebase Storage
 * @param uri Local file URI from camera/gallery
 * @param path Folder path in storage (e.g. "crime_images" or "avatars")
 */
export async function uploadImage(uri: string, path: string): Promise<string> {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();

        // Create a unique filename
        const filename = `${new Date().getTime()}-${Math.random().toString(36).substring(7)}.jpg`;
        const storageRef = ref(storage, `${path}/${filename}`);

        const snapshot = await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}
