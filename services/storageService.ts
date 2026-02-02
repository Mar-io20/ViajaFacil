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
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          callback({ ...userData, id: firebaseUser.uid });
        } else {
          // Fallback if doc doesn't exist yet
          const fallbackUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Usuário',
            role: 'ORGANIZER',
            avatar: firebaseUser.photoURL || ''
          };
          // Try to create it silently to fix future reads
          await setDoc(doc(db, "users", firebaseUser.uid), fallbackUser);
          callback(fallbackUser);
        }
      } catch (error) {
        console.error("Auth fetch error:", error);
        callback(null);
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
  
  // Return basic info if doc missing
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
  
  // Update Auth Profile if name/avatar changed
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
  
  // Create a reference to 'images/unique_name'
  const filePath = `uploads/${auth.currentUser.uid}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, filePath);
  
  // Upload
  const snapshot = await uploadBytes(storageRef, file);
  
  // Get URL
  return await getDownloadURL(snapshot.ref);
};

// --- Trips Management (Firestore) ---

// Real-time listener for trips
export const subscribeToTrips = (userId: string, callback: (trips: Trip[]) => void) => {
  // IMPORTANT: We use a compound query here. 
  // 'memberIds' array-contains 'userId' ensures we only fetch trips we are part of.
  // This matches standard Firestore Security Rules.
  const q = query(
    collection(db, "trips"), 
    where("memberIds", "array-contains", userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const myTrips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip));
    callback(myTrips);
  }, (error) => {
      console.error("Error subscribing to trips:", error);
      // If permission denied, likely rules issue or index missing.
      // Return empty array to avoid crashing UI.
      callback([]); 
  });
};

const prepareTripForSave = (trip: Trip) => {
  // Ensure memberIds matches members for indexing/security
  return {
    ...trip,
    memberIds: trip.members.map(m => m.userId)
  };
};

export const saveTrip = async (trip: Trip) => {
  const tripData = prepareTripForSave(trip);
  await setDoc(doc(db, "trips", trip.id), tripData);
};

export const createNewTrip = async (trip: Trip) => {
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

// Legacy support
export const saveUserToStorage = () => {};
export const getUserFromStorage = () => null;
export const removeUserFromStorage = () => {};
export const getTripsFromStorage = () => [];
export const saveTripsToStorage = () => {};
export const saveKnownUser = () => {};
export const getKnownUserByEmail = () => undefined;
