export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect. Please try again.";
    case "auth/email-already-in-use":
      return "Unable to create this account. Try signing in or resetting your password.";
    case "auth/weak-password":
    case "auth/password-does-not-meet-requirements":
      return "Choose a stronger password with at least 8 characters.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled. You can try again.";
    case "auth/popup-blocked":
      return "Allow popups for this site, then try Google sign-in again.";
    case "auth/account-exists-with-different-credential":
      return "Sign in using the method you originally used for this account.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait before trying again.";
    case "auth/network-request-failed":
      return "Unable to connect. Check your connection and try again.";
    case "auth/operation-not-allowed":
    case "auth/unauthorized-domain":
    case "auth/configuration-not-found":
      return "This sign-in method is not configured yet. Please contact the app administrator.";
    case "auth/user-disabled":
      return "This account is unavailable. Contact the app administrator.";
    case "auth/user-token-expired":
    case "auth/invalid-user-token":
      return "Your session has expired. Please sign in again.";
    default:
      return "Unable to complete authentication. Please try again shortly.";
  }
}
