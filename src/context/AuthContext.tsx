import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onIdTokenChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "../firebase";
import { cancelApiRequests } from "../services/api";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sessionError: string;
  login(email: string, password: string): Promise<void>;
  register(name: string, email: string, password: string): Promise<void>;
  signInWithGoogle(): Promise<void>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  getAccessToken(forceRefresh?: boolean): Promise<string | null>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const profile = (user: User): UserProfile => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");
  useEffect(() => {
    const expired = () =>
      setSessionError("Your session has expired. Please sign in again.");
    window.addEventListener("ominicode:session-expired", expired);
    return () =>
      window.removeEventListener("ominicode:session-expired", expired);
  }, []);
  const lastUid = useRef<string | null>(null);
  useEffect(
    () =>
      onIdTokenChanged(
        auth,
        (current) => {
          if (lastUid.current !== (current?.uid ?? null)) cancelApiRequests();
          lastUid.current = current?.uid ?? null;
          setFirebaseUser(current);
          setUser(current ? profile(current) : null);
          setLoading(false);
        },
        () => {
          cancelApiRequests();
          setFirebaseUser(null);
          setUser(null);
          setLoading(false);
        },
      ),
    [],
  );
  const persist = () => {
    setSessionError("");
    return setPersistence(auth, browserLocalPersistence);
  };
  const login = async (email: string, password: string) => {
    await persist();
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };
  const register = async (name: string, email: string, password: string) => {
    await persist();
    const result = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );
    await updateProfile(result.user, { displayName: name.trim() });
    setUser(profile(result.user));
  };
  const signInWithGoogle = async () => {
    await persist();
    await signInWithPopup(auth, new GoogleAuthProvider());
  };
  const logout = async () => {
    cancelApiRequests();
    await signOut(auth);
    setFirebaseUser(null);
    setUser(null);
    // Repository OAuth is separate, but do not leave its browser credentials for the next account.
    try {
      localStorage.removeItem("gh_token");
      localStorage.removeItem("gh_active_repo");
    } catch {
      /* Storage may be unavailable; Firebase sign-out still succeeded. */
    }
  };
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      if ((error as { code?: string }).code !== "auth/user-not-found")
        throw error;
    }
  };
  const getAccessToken = async (forceRefresh = false) => {
    await auth.authStateReady();
    return auth.currentUser ? auth.currentUser.getIdToken(forceRefresh) : null;
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        sessionError,
        isAuthenticated: !!user,
        login,
        register,
        signInWithGoogle,
        logout,
        resetPassword,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
