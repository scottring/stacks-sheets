import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Supplier } from '../types/supplier';

const SUPPLIERS_COLLECTION = 'suppliers';

export const addSupplier = async (supplier: Supplier): Promise<void> => {
  try {
    const supplierData = {
      ...supplier,
      lastUpdated: Timestamp.fromDate(supplier.lastUpdated)
    };
    await addDoc(collection(db, SUPPLIERS_COLLECTION), supplierData);
  } catch (error) {
    console.error('Error adding supplier:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to add supplier: ${error.message}`);
    }
    throw new Error('Failed to add supplier');
  }
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  try {
    const q = query(collection(db, SUPPLIERS_COLLECTION), orderBy('lastUpdated', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastUpdated: doc.data().lastUpdated?.toDate() || new Date(),
    } as Supplier));
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch suppliers: ${error.message}`);
    }
    throw new Error('Failed to fetch suppliers');
  }
};