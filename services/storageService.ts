import { User, Trip } from '../types';
import { auth, db, storage } from './firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- Authentication & User Management ---

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Fetch additional user data from Firestore
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          callback({ ...userData, id: firebaseUser.uid });
        } else {
          // Fallback: If doc doesn't exist, create a basic one.
          // This avoids the UI getting stuck if the registration flow was interrupted.
          const fallbackUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Usuário',
            role: 'ORGANIZER',
            avatar: firebaseUser.photoURL || ''
          };
          
          // Use setDoc with merge to be safe, though setDoc overwrites by default
          await setDoc(userDocRef, fallbackUser, { merge: true });
          callback(fallbackUser);
        }
      } catch (error) {
        console.error("Auth fetch error:", error);
        // Even if Firestore fails (permissions?), return the basic Auth info so user can at least see the app
        callback({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Usuário',
            role: 'ORGANIZER',
            avatar: firebaseUser.photoURL || ''
        });
      }
    } else {
      callback(null);
    }
  });
};

export const registerUser = async (email: string, password: string, name: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const fbUser = userCredential.user;

  // Update Auth Profile
  await updateProfile(fbUser, { displayName: name });

  const newUser: User = {
    id: fbUser.uid,
    email: email,
    name: name,
    role: 'ORGANIZER',
    avatar: ''
  };

  // Create User Document in Firestore
  // Note: This matches the rule 'allow write: if request.auth.uid == userId'
  await setDoc(doc(db, "users", fbUser.uid), newUser);

  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const fbUser = userCredential.user;
  
  const userDoc = await getDoc(doc(db, "users", fbUser.uid));
  if (userDoc.exists()) {
    return userDoc.data() as User;
  }
  
  return {
    id: fbUser.uid,
    email: fbUser.email || '',
    name: fbUser.displayName || '',
    role: 'ORGANIZER'
  };
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
  // Update Firestore
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
  
  // Update Auth Profile if needed
  if (auth.currentUser) {
     if (data.name || data.avatar) {
         await updateProfile(auth.currentUser, {
             displayName: data.name || auth.currentUser.displayName,
             photoURL: data.avatar || auth.currentUser.photoURL
         });
     }
  }
};

// --- Storage (File Upload) ---

export const uploadFile = async (file: File): Promise<string> => {
  if (!auth.currentUser) throw new Error("Usuário não autenticado");
  
  const filePath = `uploads/${auth.currentUser.uid}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, filePath);
  
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

// --- Trips Management (Firestore) ---

// Helper to ensure memberIds is always correctly populated for security rules
const prepareTripForSave = (trip: Trip) => {
  // Extract all userIds from members array
  const ids = trip.members.map(m => m.userId).filter(id => !!id);
  
  // Remove duplicates and ensure it's an array of strings
  const memberIds = [...new Set(ids)];

  return {
    ...trip,
    memberIds: memberIds
  };
};

// Real-time listener for trips
export const subscribeToTrips = (userId: string, onSuccess: (trips: Trip[]) => void, onError?: (error: any) => void) => {
  // Security Rule Compliance:
  // We MUST filter by 'memberIds array-contains userId' because the rules say:
  // allow read: if request.auth.uid in resource.data.memberIds;
  // If we try to query ALL trips, the rules will reject it immediately.
  const q = query(
    collection(db, "trips"), 
    where("memberIds", "array-contains", userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const myTrips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip));
    onSuccess(myTrips);
  }, (error) => {
      console.error("Firebase Subscription Error:", error);
      if (onError) onError(error);
  });
};

export const createNewTrip = async (trip: Trip) => {
  // Ensure we save the version with memberIds populated
  const tripData = prepareTripForSave(trip);
  await setDoc(doc(db, "trips", trip.id), tripData);
};

export const updateTripInDb = async (trip: Trip) => {
  const tripData = prepareTripForSave(trip);
  await setDoc(doc(db, "trips", trip.id), tripData, { merge: true });
};

export const deleteTripFromDb = async (tripId: string) => {
    await deleteDoc(doc(db, "trips", tripId));
};

export const generateGroupCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Legacy stubs
export const saveUserToStorage = () => {};
export const getUserFromStorage = () => null;
export const removeUserFromStorage = () => {};
export const getTripsFromStorage = () => [];
export const saveTripsToStorage = () => {};
export const saveKnownUser = () => {};
export const getKnownUserByEmail = () => undefined;
