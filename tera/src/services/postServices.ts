import { addDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

// CREATE POST
export async function createPost(post: any) {
  return await addDoc(collection(db, "posts"), {
    ...post,
    createdAt: new Date(),
  });
}

// GET FEED
export async function getPosts() {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}