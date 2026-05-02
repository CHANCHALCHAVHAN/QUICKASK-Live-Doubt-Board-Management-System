import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { getRoom, getDoubts, type Doubt } from "@/lib/store";
import { BarChart3, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Analytics = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "teacher" ? "Teacher" : "Student";
  const userName = searchParams.get("name") || "Anonymous";
  const room = roomId ? getRoom(roomId) : undefined;
  const [doubts, setDoubts] = useState<Doubt[]>([]);

  const refresh = useCallback(() => {
    if (roomId) setDoubts([...getDoubts(roomId)]);
  }, [roomId]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 3000);
    return () => clearInterval(t);
  }, [refresh]);

  if (!room) return <Navigate to="/join" replace />;

  const total = doubts.length;
  const relevant = doubts.filter(d => d.relevance === "Relevant").length;
  const irrelevant = doubts.filter(d => d.relevance === "Irrelevant").length;
  const answered = doubts.filter(d => d.answered).length;
  const pending = doubts.filter(d => !d.answered).length;

  // Per-student breakdown
  const byStudent: Record<string, { total: number; relevant: number }> = {};
  doubts.forEach(d => {
    if (!byStudent[d.studentName]) byStudent[d.studentName] = { total: 0, relevant: 0 };
    byStudent[d.studentName].total++;
    if (d.relevance === "Relevant") byStudent[d.studentName].relevant++;
  });

  const stats = [
    { label: "Total Doubts", value: total, icon: MessageSquare, color: "text-primary" },
    { label: "Relevant", value: relevant, icon: CheckCircle, color: "text-green-400" },
    { label: "Irrelevant", value: irrelevant, icon: XCircle, color: "text-destructive" },
    { label: "Answered", value: answered, icon: CheckCircle, color: "text-green-400" },
    { label: "Pending", value: pending, icon: Clock, color: "text-yellow-400" },
  ];

  return (
    <DashboardLayout roomId={room.id} subject={room.subject} role={role} userName={userName}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="font-chalk text-2xl text-foreground">Analytics</h2>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map(s => (
            <div key={s.label} className="chalk-card p-4 flex flex-col items-center gap-1 text-center">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <span className={`text-3xl font-bold ${s.color}`}>{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Relevance bar */}
        {total > 0 && (
          <div className="chalk-card p-4">
            <p className="text-sm text-muted-foreground mb-2">Relevance Ratio</p>
            <div className="w-full h-3 rounded-full bg-secondary overflow-hidden flex">
              <div className="bg-green-500 h-full transition-all" style={{ width: `${(relevant / total) * 100}%` }} />
              <div className="bg-destructive h-full transition-all" style={{ width: `${(irrelevant / total) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{Math.round((relevant / total) * 100)}% Relevant</span>
              <span>{Math.round((irrelevant / total) * 100)}% Irrelevant</span>
            </div>
          </div>
        )}

        {/* Per-student table */}
        {Object.keys(byStudent).length > 0 && (
          <div className="chalk-card p-4">
            <p className="text-sm text-muted-foreground mb-3">Per Student</p>
            <div className="space-y-2">
              {Object.entries(byStudent).map(([name, data]) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{name}</span>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{data.total} doubts</span>
                    <span className="text-green-400">{data.relevant} relevant</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {total === 0 && (
          <div className="chalk-card py-16 text-center">
            <p className="text-muted-foreground font-chalk text-xl">No data yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
