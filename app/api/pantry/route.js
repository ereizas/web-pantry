import { firestore } from '../firebase'; // Adjust import path if necessary
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export async function GET() {
  // Fetch all pantry items
  const snapshot = await getDocs(collection(firestore, 'pantry'));
  const pantryList = [];
  snapshot.forEach(doc => {
    pantryList.push({ name: doc.id, ...doc.data() });
  });
  return new Response(JSON.stringify(pantryList), { status: 200 });
}

export async function POST(request) {
  const { item } = await request.json();
  const docRef = doc(collection(firestore, 'pantry'), item);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const { count } = docSnap.data();
    await setDoc(docRef, { count: count + 1 });
  } else {
    await setDoc(docRef, { count: 1 });
  }
  return new Response(JSON.stringify({ message: 'Item added' }), { status: 200 });
}

export async function DELETE(request) {
  const { item } = await request.json();
  const docRef = doc(collection(firestore, 'pantry'), item);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const { count } = docSnap.data();
    if (count === 1) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, { count: count - 1 });
    }
  }
  return new Response(JSON.stringify({ message: 'Item removed' }), { status: 200 });
}
