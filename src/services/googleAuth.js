import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import app from '../config/firebase';

// Initialize Firebase Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account' // Always show account selection
});

/**
 * Sign in with Google using Firebase
 * @returns {Promise<{success: boolean, idToken?: string, error?: string}>}
 */
export const signInWithGoogle = async () => {
  try {
    console.log('[Google Auth] Initiating sign-in...');
    
    // Sign in with popup
    const result = await signInWithPopup(auth, googleProvider);
    
    // Get the ID token
    const idToken = await result.user.getIdToken();
    
    console.log('[Google Auth] Sign-in successful');
    
    return {
      success: true,
      idToken,
      user: {
        email: result.user.email,
        name: result.user.displayName,
        avatar: result.user.photoURL,
      }
    };
  } catch (error) {
    console.error('[Google Auth] Error:', error);
    
    // Handle specific error codes
    let errorMessage = 'Failed to sign in with Google';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in cancelled';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked by browser. Please allow popups and try again.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Sign out from Firebase
 */
export const signOutGoogle = async () => {
  try {
    await auth.signOut();
    console.log('[Google Auth] Signed out successfully');
  } catch (error) {
    console.error('[Google Auth] Error signing out:', error);
  }
};

