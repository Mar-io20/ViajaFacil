import { User, Trip } from '../types';

/**
 * Service to handle file uploads.
 * In a production environment, this would verify Firebase Auth state
 * and upload to Firebase Storage bucket.
 * 
 * Current implementation: Converts to Base64 for local demo persistence.
 */

const USER_KEY = 'viajafacil_user';
const TRIPS_KEY = 'viajafacil_trips';

// --- User Persistence ---

export const saveUserToStorage = (user: User) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Error saving user", e);
  }
};

export const getUserFromStorage = (): User | null => {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const removeUserFromStorage = () => {
  localStorage.removeItem(USER_KEY);
};

// --- Trips Persistence ---

export const saveTripsToStorage = (trips: Trip[]) => {
  try {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  } catch (e) {
    console.error("Error saving trips", e);
  }
};

export const getTripsFromStorage = (): Trip[] | null => {
  try {
    const data = localStorage.getItem(TRIPS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

// --- Existing File Logic ---

export const uploadFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file size (max 5MB for demo)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("Arquivo muito grande. Máximo de 5MB."));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        // Simulate network delay
        setTimeout(() => {
          resolve(event.target!.result as string);
        }, 1000);
      } else {
        reject(new Error("Falha ao ler arquivo."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Erro ao ler arquivo."));
    };

    reader.readAsDataURL(file);
  });
};

export const generateGroupCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
