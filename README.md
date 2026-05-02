<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=35&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=700&lines=⚡+QUICKASK;Live+Doubt+Board+Management;Classroom+Made+Smarter!" alt="Typing SVG" />

<br/>

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

<br/>

> 🎓 **A real-time doubt management platform that bridges the gap between teachers and students — instantly, intelligently, and beautifully.**

<br/>

![Demo GIF](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDZ4dGQyejl5eTh5dmluN2g5cHllNXRldm16NWVpaXVrb2kyaGVlZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26AHONQ79FdWZhAI0/giphy.gif)

</div>

---

## 🌟 What is QUICKASK?

**QUICKASK** is a **Live Doubt Board Management System** built for modern classrooms. Teachers create secure rooms 🔐, students join via Room ID, submit doubts in real-time 💬, and the system intelligently analyzes relevance — all without any backend or authentication overhead.

Whether you're teaching a lecture of 5 or 500, QUICKASK keeps your classroom organized, interactive, and doubt-free ✅.

---

## ✨ Features

<table>
<tr>
<td>

### 🏫 For Teachers
- 🔑 Create rooms with unique Room IDs & tokens
- 📋 Live Teacher Board showing all student doubts
- ✅ Mark doubts as **Answered** with one click
- 📊 Analytics dashboard with visual charts
- 👥 View all room participants
- 💬 Live Discussion thread on resolved doubts

</td>
<td>

### 🎒 For Students
- 🚪 Join rooms instantly with a Room ID
- ✍️ Submit doubts with a clean, minimal UI
- 🤖 AI-powered **Relevance Analysis** on submission
- 📌 Track your submitted doubts & their status
- 💬 Participate in Live Discussion threads
- 📱 Fully responsive — works on mobile too!

</td>
</tr>
</table>

---

## 🧠 Smart Relevance Analyzer

> 🤖 QUICKASK analyzes each submitted doubt automatically!

When a student submits a doubt, the system evaluates it against the room's **subject context** and immediately tags it as:

| Badge | Meaning |
|-------|---------|
| ✅ `Relevant` | Doubt is on-topic and meaningful |
| ❌ `Irrelevant` | Off-topic or unclear doubt |
| ⏳ `Analyzing...` | Processing in progress |

This helps teachers **prioritize** what truly matters in the classroom.

---

## 🛣️ App Routes & Pages

```
/                          → 🏠 Home / Landing
/create                    → 🔧 Create a Room (Teacher)
/room-created/:roomId      → 🎉 Room Created (QR + Share)
/join                      → 🚪 Join a Room (Student)
/room/:roomId/doubts       → 📋 Teacher Board / Student Doubt Submission
/room/:roomId/analytics    → 📊 Analytics Dashboard
/room/:roomId/discussion   → 💬 Live Discussion
/room/:roomId/participants → 👥 Participants List
```

---

## 🗂️ Project Structure

```
quickask/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── DashboardLayout.tsx    # Shared layout with nav
│   │   ├── NavLink.tsx            # Sidebar navigation links
│   │   └── 📁 ui/                 # shadcn/ui component library
│   ├── 📁 pages/
│   │   ├── Index.tsx              # Landing page
│   │   ├── CreateRoom.tsx         # Teacher room creation
│   │   ├── RoomCreated.tsx        # Room share page (QR code)
│   │   ├── JoinRoom.tsx           # Student join flow
│   │   ├── Submission.tsx         # Doubt submission + Teacher board
│   │   ├── TeacherBoard.tsx       # Teacher doubt management view
│   │   ├── StudentDoubt.tsx       # Student doubt submission view
│   │   ├── Analytics.tsx          # Charts & analytics
│   │   ├── LiveDiscussion.tsx     # Discussion threads
│   │   └── Participants.tsx       # Room participants list
│   ├── 📁 lib/
│   │   ├── store.ts               # State management (localStorage)
│   │   └── utils.ts               # Utility helpers
│   ├── 📁 hooks/
│   │   ├── use-mobile.tsx         # Responsive hook
│   │   └── use-toast.ts           # Toast notifications
│   ├── App.tsx                    # Root app + routing
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── public/                        # Static assets
├── index.html                     # HTML shell
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

---

## ⚙️ Tech Stack

| Technology | Purpose |
|---|---|
| ⚛️ **React 18** | UI Framework |
| 🔷 **TypeScript** | Type Safety |
| ⚡ **Vite** | Build Tool & Dev Server |
| 🎨 **Tailwind CSS** | Styling |
| 🧩 **shadcn/ui** | UI Components |
| 🛣️ **React Router v6** | Client-Side Routing |
| 🔄 **TanStack Query** | Server State Management |
| 📊 **Recharts** | Analytics Charts |
| 📱 **QRCode.react** | QR Code for Room Sharing |
| 💾 **localStorage** | Persistent State (no backend!) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js 18+** or **Bun** installed.

```bash
node --version   # v18+
bun --version    # Optional but faster!
```

### 1️⃣ Clone the repository

```bash
git clone https://github.com/CHANCHALCHAVHAN/QUICKASK-Live-Doubt-Board-Management-System.git
cd QUICKASK-Live-Doubt-Board-Management-System
```

### 2️⃣ Install dependencies

```bash
# Using npm
npm install

# Using bun (faster! ⚡)
bun install
```

### 3️⃣ Start development server

```bash
# Using npm
npm run dev

# Using bun
bun dev
```

### 4️⃣ Open in browser

```
http://localhost:8080
```

---

## 🏗️ Build for Production

```bash
npm run build
# or
bun run build
```

Preview the production build:
```bash
npm run preview
```

---

## 🔄 How It Works

```
┌─────────────────────────────────────────────────────┐
│                  QUICKASK FLOW                       │
│                                                      │
│  👨‍🏫 Teacher                        🎒 Student        │
│      │                                   │           │
│      ▼                                   ▼           │
│  Create Room ──────► Room ID ◄─────── Join Room     │
│      │                                   │           │
│      ▼                                   ▼           │
│  Teacher Board                   Submit Doubt        │
│  (Live Updates)                       │              │
│      │              ⚡ Realtime        │              │
│      ◄──────────── Doubt Appears ─────►              │
│      │                                               │
│      ▼                                               │
│  Mark ✅ Answered                                    │
│      │                                               │
│      ▼                                               │
│  💬 Live Discussion opens for that doubt             │
│  📊 Analytics updated automatically                  │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Analytics Dashboard

The analytics page provides visual insights including:

- 📈 **Doubt submission trends** over time
- 🥧 **Relevance ratio** — Relevant vs Irrelevant doubts
- ✅ **Resolution rate** — Answered vs Pending
- 👥 **Participant engagement** stats

---

## 🧪 Running Tests

```bash
npm run test         # Run tests once
npm run test:watch   # Watch mode
```

---

## 🤝 Contributing

We welcome contributions from the community! 🙌

```bash
# 1. Fork the repo
# 2. Create your branch
git checkout -b feature/amazing-feature

# 3. Commit changes
git commit -m "✨ Add amazing feature"

# 4. Push and open a PR
git push origin feature/amazing-feature
```

Please follow the existing code style and include tests where applicable.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

### 🌟 If QUICKASK helped you, give it a star!

[![GitHub stars](https://img.shields.io/github/stars/CHANCHALCHAVHAN/QUICKASK-Live-Doubt-Board-Management-System?style=social)](https://github.com/CHANCHALCHAVHAN/QUICKASK-Live-Doubt-Board-Management-System/stargazers)

<br/>

Made with ❤️ by [Chanchal Chavhan](https://github.com/CHANCHALCHAVHAN)

<br/>

*⚡ Empowering classrooms, one doubt at a time.*

</div>
