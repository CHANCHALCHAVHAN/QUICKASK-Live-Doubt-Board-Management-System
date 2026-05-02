// Store for rooms, doubts, and participants (persisted in localStorage)

export interface Room {
  id: string;
  token: string;
  teacherName: string;
  subject: string;
  createdAt: Date;
}

export interface Doubt {
  id: string;
  roomId: string;
  studentName: string;
  text: string;
  timestamp: Date;
  relevance: "Relevant" | "Irrelevant" | "Analyzing...";
  answered: boolean;
  discussion: string[];
}

export interface Participant {
  name: string;
  role: "Teacher" | "Student";
  joinedAt: Date;
}

const ROOMS_KEY = "qa_rooms";
const DOUBTS_KEY = "qa_doubts";
const PARTICIPANTS_KEY = "qa_participants";

const rooms: Map<string, Room> = new Map();
const doubts: Map<string, Doubt[]> = new Map();
const participants: Map<string, Participant[]> = new Map();
const listeners: Map<string, Set<() => void>> = new Map();

function syncFromStorage() {
  try {
    const rawRooms = localStorage.getItem(ROOMS_KEY);
    if (rawRooms) {
      const parsed: Room[] = JSON.parse(rawRooms);
      parsed.filter(r => !!r.token).forEach(r => {
        r.createdAt = new Date(r.createdAt);
        rooms.set(r.id, r);
      });
    }
    const rawDoubts = localStorage.getItem(DOUBTS_KEY);
    if (rawDoubts) {
      const parsed: Record<string, Doubt[]> = JSON.parse(rawDoubts);
      Object.entries(parsed).forEach(([roomId, ds]) => {
        doubts.set(roomId, ds.map(d => ({ ...d, timestamp: new Date(d.timestamp), discussion: d.discussion || [] })));
      });
    }
    const rawParticipants = localStorage.getItem(PARTICIPANTS_KEY);
    if (rawParticipants) {
      const parsed: Record<string, Participant[]> = JSON.parse(rawParticipants);
      Object.entries(parsed).forEach(([roomId, ps]) => {
        participants.set(roomId, ps.map(p => ({ ...p, joinedAt: new Date(p.joinedAt) })));
      });
    }
  } catch {}
}

function saveAll() {
  localStorage.setItem(ROOMS_KEY, JSON.stringify([...rooms.values()]));
  localStorage.setItem(DOUBTS_KEY, JSON.stringify(Object.fromEntries(doubts)));
  localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(Object.fromEntries(participants)));
}

syncFromStorage();

function generateId(len = 6): string {
  return Math.random().toString(36).substring(2, 2 + len).toUpperCase();
}

export function createRoom(teacherName: string, subject: string): Room {
  const id = generateId(6);
  const token = generateId(6);
  const room: Room = { id, token, teacherName, subject, createdAt: new Date() };
  rooms.set(id, room);
  doubts.set(id, []);
  participants.set(id, [{ name: teacherName, role: "Teacher", joinedAt: new Date() }]);
  saveAll();
  return room;
}

export function getRoom(roomId: string): Room | undefined {
  syncFromStorage();
  return rooms.get(roomId.toUpperCase());
}

export function joinRoom(roomId: string, studentName: string) {
  const key = roomId.toUpperCase();
  syncFromStorage();
  const ps = participants.get(key) || [];
  if (!ps.find(p => p.name === studentName && p.role === "Student")) {
    ps.push({ name: studentName, role: "Student", joinedAt: new Date() });
    participants.set(key, ps);
    saveAll();
    notifyListeners(key);
  }
}

export function getParticipants(roomId: string): Participant[] {
  syncFromStorage();
  return participants.get(roomId.toUpperCase()) || [];
}

export function getDoubts(roomId: string): Doubt[] {
  syncFromStorage();
  return doubts.get(roomId.toUpperCase()) || [];
}

export function addDoubt(roomId: string, studentName: string, text: string): Doubt {
  const doubt: Doubt = {
    id: generateId(8),
    roomId: roomId.toUpperCase(),
    studentName,
    text,
    timestamp: new Date(),
    relevance: "Analyzing...",
    answered: false,
    discussion: [],
  };
  const key = roomId.toUpperCase();
  const roomDoubts = doubts.get(key) || [];
  roomDoubts.push(doubt);
  doubts.set(key, roomDoubts);
  saveAll();
  notifyListeners(key);
  return doubt;
}

export function updateDoubtRelevance(roomId: string, doubtId: string, relevance: "Relevant" | "Irrelevant") {
  const key = roomId.toUpperCase();
  const roomDoubts = doubts.get(key);
  if (roomDoubts) {
    const doubt = roomDoubts.find(d => d.id === doubtId);
    if (doubt) {
      doubt.relevance = relevance;
      saveAll();
      notifyListeners(key);
    }
  }
}

export function markAsAnswered(roomId: string, doubtId: string) {
  const key = roomId.toUpperCase();
  const roomDoubts = doubts.get(key);
  if (roomDoubts) {
    const doubt = roomDoubts.find(d => d.id === doubtId);
    if (doubt) {
      doubt.answered = true;
      saveAll();
      notifyListeners(key);
    }
  }
}

export function addDiscussionReply(roomId: string, doubtId: string, reply: string) {
  const key = roomId.toUpperCase();
  const roomDoubts = doubts.get(key);
  if (roomDoubts) {
    const doubt = roomDoubts.find(d => d.id === doubtId);
    if (doubt) {
      doubt.discussion.push(reply);
      saveAll();
      notifyListeners(key);
    }
  }
}

export function subscribe(roomId: string, callback: () => void): () => void {
  const key = roomId.toUpperCase();
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(callback);
  return () => listeners.get(key)?.delete(callback);
}

function notifyListeners(roomId: string) {
  listeners.get(roomId)?.forEach(cb => cb());
}
