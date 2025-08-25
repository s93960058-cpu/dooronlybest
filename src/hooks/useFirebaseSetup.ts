import { useEffect } from 'react';
import { collection, doc, setDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { doorsData } from '../data/doors';
import { businessInfo } from '../data/business';

export const useFirebaseSetup = () => {
  useEffect(() => {
    const setupFirebase = async () => {
      try {
        // Check if doors collection exists
        const doorsSnapshot = await getDocs(collection(db, 'doors'));
        if (doorsSnapshot.empty) {
          console.log('Setting up doors collection...');
          // Add all doors from data
          for (const door of doorsData) {
            await setDoc(doc(db, 'doors', door.id), {
              ...door,
              created_at: Timestamp.now(),
              updated_at: Timestamp.now()
            });
          }
          console.log('Doors collection created successfully!');
        } else {
          console.log('Doors collection already exists with', doorsSnapshot.size, 'documents');
        }

        // Check if business collection exists
        const businessSnapshot = await getDocs(collection(db, 'business'));
        if (businessSnapshot.empty) {
          console.log('Setting up business collection...');
          await setDoc(doc(db, 'business', 'main'), {
            ...businessInfo,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now()
          });
          console.log('Business collection created successfully!');
        } else {
          console.log('Business collection already exists with', businessSnapshot.size, 'documents');
        }

        // Contacts collection will be created automatically when first contact is submitted
        console.log('Firebase setup completed!');
      } catch (error) {
        console.error('Error setting up Firebase:', error);
      }
    };

    setupFirebase();
  }, []);
};