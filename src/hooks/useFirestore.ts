import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const useFirestore = <T extends { id?: string }>(collectionName: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`Setting up listener for collection: ${collectionName}`);
    
    const q = query(collection(db, collectionName), orderBy('created_at', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log(`Received ${snapshot.docs.length} documents from ${collectionName}`);
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Error listening to ${collectionName}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      console.log(`Cleaning up listener for ${collectionName}`);
      unsubscribe();
    };
  }, [collectionName]);

  const addItem = async (item: Omit<T, 'id'>) => {
    try {
      console.log(`Adding item to ${collectionName}:`, item);
      const docRef = await addDoc(collection(db, collectionName), {
        ...item,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      });
      console.log('Item added successfully with ID:', docRef.id);
      return docRef.id;
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בהוספת פריט');
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    try {
      console.log(`Updating item ${id} in ${collectionName}:`, updates);
      await updateDoc(doc(db, collectionName, id), {
        ...updates,
        updated_at: Timestamp.now()
      });
      console.log('Item updated successfully:', id);
    } catch (err) {
      console.error('Error updating item:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בעדכון פריט');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      console.log(`Deleting item ${id} from ${collectionName}`);
      await deleteDoc(doc(db, collectionName, id));
      console.log('Item deleted successfully:', id);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err instanceof Error ? err.message : 'שגיאה במחיקת פריט');
      throw err;
    }
  };

  return { data, loading, error, addItem, updateItem, deleteItem };
};