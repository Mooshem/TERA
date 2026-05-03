import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

export function useGoogleSignIn() {
  const promptAsync = () => {
    console.log("Google Sign-In clicked (not implemented yet)");
  };

  return {
    promptAsync,
  };
}