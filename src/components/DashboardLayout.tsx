import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, BarChart3, LogOut, Menu, Users, GraduationCap, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
  roomId: string;
  subject: string;
  role: "Teacher" | "Student";
  userName: string;
}

const DashboardLayout = ({ children, roomId, subject, role, userName }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const roleParam = role === "Teacher" ? "teacher" : "student";
  const nameParam = encodeURIComponent(userName);
  const base = `/room/${roomId}`;

  const navItems = [
    { label: "Doubts", icon: MessageSquare, path: `${base}/doubts?role=${roleParam}&name=${nameParam}` },
    { label: "Analytics", icon: BarChart3, path: `${base}/analytics?role=${roleParam}&name=${nameParam}` },
    { label: "Discussion", icon: MessagesSquare, path: `${base}/discussion?role=${roleParam}&name=${nameParam}` },
    { label: "Participants", icon: Users, path: `${base}/participants?role=${roleParam}&name=${nameParam}` },
  ];

  const isActive = (path: string) => location.pathname === path.split("?")[0];

  return (
    <div className="min-h-screen chalkboard-bg flex">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-sidebar border-r border-dashed border-sidebar-border flex flex-col transition-transform duration-200 md:translate-x-0 md:static md:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-dashed border-sidebar-border">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <h1 className="font-chalk text-2xl text-foreground">Live Doubt Board</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive(item.path)
                  ? "text-sidebar-foreground bg-sidebar-accent"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-dashed border-sidebar-border">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground">{role}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-destructive" onClick={() => navigate("/")}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-dashed border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Room:</span>
              <span className="font-mono font-bold text-primary tracking-wider">{roomId}</span>
              <span className="text-border mx-1">|</span>
              <span className="text-muted-foreground">Subject:</span>
              <span className="font-medium text-foreground">{subject}</span>
            </div>
          </div>
          <span className={`hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border border-dashed ${
            role === "Teacher" ? "border-primary text-primary" : "border-green-500 text-green-400"
          }`}>
            {role}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
