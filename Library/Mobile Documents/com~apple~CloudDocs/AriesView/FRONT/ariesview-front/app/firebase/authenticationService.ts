import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./config";

//signUp functions for authentication
const signUpUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

//signIn functions for authentication
const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

//signOut functions for authentication
const signOutUser = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Export the functions for use in other parts of the application
export { signUpUser, signInUser, signOutUser };
