import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebase";

export function useGoogleSignIn() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  const signInWithGoogle = async () => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;

      if (!idToken) return;

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
    }
  };

  return {
    request,
    promptAsync,       // frontend uses this
    signInWithGoogle,  // optional trigger
  };
}