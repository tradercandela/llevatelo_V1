import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch 
} from './firebase';
import { Store, Product, Courier, Order } from '../types';
import { STORES, PRODUCTS, INITIAL_COURIERS } from '../data/mockData';

// Firestore collections
const STORES_COLLECTION = 'stores';
const PRODUCTS_COLLECTION = 'products';
const COURIERS_COLLECTION = 'couriers';
const ORDERS_COLLECTION = 'orders';

/**
 * Strips undefined properties recursively so Firestore does not throw errors
 */
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    return value === undefined ? null : value;
  }));
}

/**
 * Checks if the remote Firestore database is populated; if empty, seeds initial data.
 */
export async function seedInitialDataIfEmpty(initialOrders: Order[] = []): Promise<void> {
  try {
    const storesSnapshot = await getDocs(collection(db, STORES_COLLECTION));
    if (!storesSnapshot.empty) {
      console.log(`[Firestore] Database already seeded with ${storesSnapshot.size} stores.`);
      return;
    }

    console.log('[Firestore] Seeding initial marketplace data...');
    const batch = writeBatch(db);

    // 1. Seed Stores
    for (const store of STORES) {
      const ref = doc(db, STORES_COLLECTION, store.id);
      batch.set(ref, sanitizeForFirestore(store));
    }

    // 2. Seed Products
    for (const product of PRODUCTS) {
      const ref = doc(db, PRODUCTS_COLLECTION, product.id);
      batch.set(ref, sanitizeForFirestore(product));
    }

    // 3. Seed Couriers
    for (const courier of INITIAL_COURIERS) {
      const ref = doc(db, COURIERS_COLLECTION, courier.id);
      batch.set(ref, sanitizeForFirestore(courier));
    }

    // 4. Seed Initial Orders (if any)
    for (const order of initialOrders) {
      const ref = doc(db, ORDERS_COLLECTION, order.id);
      batch.set(ref, sanitizeForFirestore(order));
    }

    await batch.commit();
    console.log('[Firestore] Successfully seeded initial data to Firestore.');
  } catch (error) {
    console.warn('[Firestore] Note on seeding:', error);
  }
}

/**
 * Subscribe to Stores in real-time
 */
export function subscribeToStores(onData: (stores: Store[]) => void): () => void {
  try {
    const collRef = collection(db, STORES_COLLECTION);
    return onSnapshot(collRef, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => d.data() as Store);
        onData(list);
      }
    }, (err) => {
      console.warn('[Firestore] stores listener fallback:', err.message);
    });
  } catch (e) {
    console.warn('[Firestore] subscribeToStores error:', e);
    return () => {};
  }
}

/**
 * Subscribe to Products in real-time
 */
export function subscribeToProducts(onData: (products: Product[]) => void): () => void {
  try {
    const collRef = collection(db, PRODUCTS_COLLECTION);
    return onSnapshot(collRef, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => d.data() as Product);
        onData(list);
      }
    }, (err) => {
      console.warn('[Firestore] products listener fallback:', err.message);
    });
  } catch (e) {
    console.warn('[Firestore] subscribeToProducts error:', e);
    return () => {};
  }
}

/**
 * Subscribe to Couriers in real-time
 */
export function subscribeToCouriers(onData: (couriers: Courier[]) => void): () => void {
  try {
    const collRef = collection(db, COURIERS_COLLECTION);
    return onSnapshot(collRef, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => d.data() as Courier);
        onData(list);
      }
    }, (err) => {
      console.warn('[Firestore] couriers listener fallback:', err.message);
    });
  } catch (e) {
    console.warn('[Firestore] subscribeToCouriers error:', e);
    return () => {};
  }
}

/**
 * Subscribe to Orders in real-time
 */
export function subscribeToOrders(onData: (orders: Order[]) => void): () => void {
  try {
    const collRef = collection(db, ORDERS_COLLECTION);
    return onSnapshot(collRef, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => d.data() as Order);
        onData(list);
      }
    }, (err) => {
      console.warn('[Firestore] orders listener fallback:', err.message);
    });
  } catch (e) {
    console.warn('[Firestore] subscribeToOrders error:', e);
    return () => {};
  }
}

// ----------------- CRUD WRITES -----------------

export async function dbSaveStore(store: Store): Promise<void> {
  try {
    await setDoc(doc(db, STORES_COLLECTION, store.id), sanitizeForFirestore(store));
  } catch (e) {
    console.warn('[Firestore] Error saving store:', e);
  }
}

export async function dbUpdateStore(storeId: string, updates: Partial<Store>): Promise<void> {
  try {
    await updateDoc(doc(db, STORES_COLLECTION, storeId), sanitizeForFirestore(updates));
  } catch (e) {
    console.warn('[Firestore] Error updating store:', e);
  }
}

export async function dbDeleteStore(storeId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, STORES_COLLECTION, storeId));
  } catch (e) {
    console.warn('[Firestore] Error deleting store:', e);
  }
}

export async function dbSaveProduct(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), sanitizeForFirestore(product));
  } catch (e) {
    console.warn('[Firestore] Error saving product:', e);
  }
}

export async function dbUpdateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  try {
    await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), sanitizeForFirestore(updates));
  } catch (e) {
    console.warn('[Firestore] Error updating product:', e);
  }
}

export async function dbDeleteProduct(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (e) {
    console.warn('[Firestore] Error deleting product:', e);
  }
}

export async function dbSaveCourier(courier: Courier): Promise<void> {
  try {
    await setDoc(doc(db, COURIERS_COLLECTION, courier.id), sanitizeForFirestore(courier));
  } catch (e) {
    console.warn('[Firestore] Error saving courier:', e);
  }
}

export async function dbUpdateCourier(courierId: string, updates: Partial<Courier>): Promise<void> {
  try {
    await updateDoc(doc(db, COURIERS_COLLECTION, courierId), sanitizeForFirestore(updates));
  } catch (e) {
    console.warn('[Firestore] Error updating courier:', e);
  }
}

export async function dbDeleteCourier(courierId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COURIERS_COLLECTION, courierId));
  } catch (e) {
    console.warn('[Firestore] Error deleting courier:', e);
  }
}

export async function dbSaveOrder(order: Order): Promise<void> {
  try {
    await setDoc(doc(db, ORDERS_COLLECTION, order.id), sanitizeForFirestore(order));
  } catch (e) {
    console.warn('[Firestore] Error saving order:', e);
  }
}

export async function dbUpdateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
  try {
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), sanitizeForFirestore(updates));
  } catch (e) {
    console.warn('[Firestore] Error updating order:', e);
  }
}

export async function dbDeleteOrder(orderId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
  } catch (e) {
    console.warn('[Firestore] Error deleting order:', e);
  }
}
