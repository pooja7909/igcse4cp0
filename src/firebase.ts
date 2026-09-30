import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  Firestore,
} from "firebase/firestore";
import { Assessment, StudentSession } from "./types";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific databaseId if provided
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

/**
 * Persist or update an assessment in Firestore
 */
export async function syncAssessmentToFirestore(assessment: Assessment): Promise<void> {
  if (!assessment || !assessment.id) return;
  try {
    const docRef = doc(db, "assessments", assessment.id);
    // Sanitize any undefined properties for Firestore
    const cleanAssessment = JSON.parse(JSON.stringify(assessment));
    await setDoc(docRef, cleanAssessment, { merge: true });
  } catch (err) {
    console.warn("Failed to sync assessment to Firestore:", err);
  }
}

/**
 * Retrieve an assessment from Firestore by ID or PIN code
 */
export async function fetchAssessmentFromFirestore(codeOrId: string): Promise<Assessment | null> {
  if (!codeOrId) return null;
  const upper = codeOrId.trim().toUpperCase();

  try {
    // 1. Try direct ID lookup
    const directRef = doc(db, "assessments", codeOrId);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) {
      return directSnap.data() as Assessment;
    }

    // 2. Query by code (case-insensitive uppercase match)
    const q = query(collection(db, "assessments"), where("code", "==", upper));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Assessment;
    }

    // 3. Query by code matching original string
    if (upper !== codeOrId) {
      const qOrig = query(collection(db, "assessments"), where("code", "==", codeOrId));
      const origSnapshot = await getDocs(qOrig);
      if (!origSnapshot.empty) {
        return origSnapshot.docs[0].data() as Assessment;
      }
    }
  } catch (err) {
    console.warn("Error fetching assessment from Firestore:", err);
  }

  return null;
}

/**
 * Real-time listener for student sessions of a specific assessment.
 * Calls onUpdate with a map of { [studentId]: StudentSession } whenever any student
 * joins, answers a question, or submits their test.
 */
export function subscribeToAssessmentStudents(
  assessmentId: string,
  onUpdate: (students: Record<string, StudentSession>) => void
): () => void {
  if (!assessmentId) return () => {};

  try {
    const studentsCol = collection(db, "assessments", assessmentId, "students");
    const unsubscribe = onSnapshot(
      studentsCol,
      (snapshot) => {
        const studentMap: Record<string, StudentSession> = {};
        snapshot.forEach((docSnap) => {
          studentMap[docSnap.id] = docSnap.data() as StudentSession;
        });
        onUpdate(studentMap);
      },
      (error) => {
        console.warn("Firestore live student subscription error:", error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("Could not attach Firestore student listener:", err);
    return () => {};
  }
}

/**
 * Save or update a single student's live progress or final submission in Firestore
 */
export async function syncStudentSessionToFirestore(
  assessmentId: string,
  studentSession: Partial<StudentSession> & { studentId: string }
): Promise<void> {
  if (!assessmentId || !studentSession || !studentSession.studentId) return;

  try {
    const studentDocRef = doc(db, "assessments", assessmentId, "students", studentSession.studentId);
    const cleanSession = JSON.parse(
      JSON.stringify({
        ...studentSession,
        lastActiveAt: Date.now(),
      })
    );
    await setDoc(studentDocRef, cleanSession, { merge: true });
  } catch (err) {
    console.warn("Failed to sync student session to Firestore:", err);
  }
}

/**
 * Retrieve all assessments stored in Firestore
 */
export async function fetchAllAssessmentsFromFirestore(): Promise<Assessment[]> {
  try {
    const colRef = collection(db, "assessments");
    const snapshot = await getDocs(colRef);
    const list: Assessment[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as Assessment);
    });
    return list;
  } catch (err) {
    console.warn("Failed to fetch all assessments from Firestore:", err);
    return [];
  }
}

/**
 * Real-time listener for all assessments across devices
 */
export function subscribeToAllAssessments(
  onUpdate: (assessments: Assessment[]) => void
): () => void {
  try {
    const colRef = collection(db, "assessments");
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: Assessment[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as Assessment);
        });
        onUpdate(list);
      },
      (err) => {
        console.warn("Firestore all assessments subscription error:", err);
      }
    );
  } catch (err) {
    console.warn("Could not attach all assessments listener:", err);
    return () => {};
  }
}

/**
 * Persist teacher custom question to Firestore
 */
export async function syncCustomQuestionToFirestore(question: any): Promise<void> {
  if (!question || !question.id) return;
  try {
    const docRef = doc(db, "custom_questions", question.id);
    const cleanQ = JSON.parse(JSON.stringify(question));
    await setDoc(docRef, cleanQ, { merge: true });
  } catch (err) {
    console.warn("Failed to sync custom question to Firestore:", err);
  }
}

/**
 * Real-time listener for teacher custom questions across devices
 */
export function subscribeToCustomQuestions(
  onUpdate: (questions: any[]) => void
): () => void {
  try {
    const colRef = collection(db, "custom_questions");
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((d) => {
          list.push(d.data());
        });
        onUpdate(list);
      },
      (err) => {
        console.warn("Firestore custom questions listener error:", err);
      }
    );
  } catch (err) {
    console.warn("Could not attach custom questions listener:", err);
    return () => {};
  }
}

