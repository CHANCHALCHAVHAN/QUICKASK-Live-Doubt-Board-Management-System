import { useState, useEffect, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRoom, getDoubts, markAsAnswered, subscribe, type Doubt } from "@/lib/store";
import { CheckCircle, XCircle, Clock, Check, MessageSquare } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const TeacherBoard = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const room = roomId ? getRoom(roomId) : undefined;
  const [doubts, setDoubts] = useState<Doubt[]>([]);

  const refresh = useCallback(() => {
    if (roomId) setDoubts([...getDoubts(roomId)]);
  }, [roomId]);

  useEffect(() => {
    refresh();
    if (roomId) {
      const unsub = subscribe(roomId, refresh);
      return unsub;
    }
  }, [roomId, refresh]);

  useEffect(() => {
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (!room) return <Navigate to="/create" replace />;

  const handleMarkAnswered = (doubtId: string) => {
    if (roomId) {
      markAsAnswered(roomId, doubtId);
      refresh();
    }
  };

  const unanswered = doubts.filter(d => !d.answered);
  const answered = doubts.filter(d => d.answered);

  return (
    <DashboardLayout roomId={room.id} subject={room.subject} role="Teacher" userName={room.teacherName}>
      <div className="max-w-3xl mx-auto">
        {/* Stats */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="chalk-card px-4 py-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="font-bold text-foreground">{doubts.length}</span>
          </div>
          <div className="chalk-card px-4 py-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Pending:</span>
            <span className="font-bold text-primary">{unanswered.length}</span>
          </div>
          <div className="chalk-card px-4 py-2 flex items-center gap-2">
            <Check className="h-4 w-4 text-success" />
            <span className="text-sm text-muted-foreground">Answered:</span>
            <span className="font-bold text-success">{answered.length}</span>
          </div>
        </div>

        {doubts.length === 0 && (
          <div className="chalk-card py-16 text-center">
            <Clock className="mx-auto h-10 w-10 mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground font-chalk text-xl">No doubts submitted yet.</p>
            <p className="text-xs mt-2 text-muted-foreground">
              Share Room ID <strong className="text-primary font-mono">{room.id}</strong> with students
            </p>
          </div>
        )}

        {unanswered.length > 0 && (
          <div className="space-y-3 mb-8">
            <h2 className="font-chalk text-xl text-muted-foreground">Pending Doubts</h2>
            {unanswered.map(d => (
              <DoubtCard key={d.id} doubt={d} onMarkAnswered={handleMarkAnswered} />
            ))}
          </div>
        )}

        {answered.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-chalk text-xl text-muted-foreground">Answered</h2>
            {answered.map(d => (
              <DoubtCard key={d.id} doubt={d} onMarkAnswered={handleMarkAnswered} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

function DoubtCard({ doubt, onMarkAnswered }: { doubt: Doubt; onMarkAnswered: (id: string) => void }) {
  return (
    <div className={`chalk-card p-4 transition-opacity ${doubt.answered ? "opacity-50" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-sm font-medium text-foreground">{doubt.studentName}</span>
            <span className="text-xs text-muted-foreground">
              {doubt.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            {doubt.relevance === "Relevant" ? (
              <Badge className="text-xs bg-success/20 text-success border border-dashed border-success/40 hover:bg-success/20">
                <CheckCircle className="mr-1 h-3 w-3" /> Relevant
              </Badge>
            ) : doubt.relevance === "Irrelevant" ? (
              <Badge className="text-xs bg-destructive/20 text-destructive border border-dashed border-destructive/40 hover:bg-destructive/20">
                <XCircle className="mr-1 h-3 w-3" /> Irrelevant
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs border border-dashed">Analyzing...</Badge>
            )}
          </div>
          <p className="text-sm text-foreground/90">{doubt.text}</p>
        </div>
        {!doubt.answered && (
          <Button variant="outline" size="sm" onClick={() => onMarkAnswered(doubt.id)} className="shrink-0 border-dashed">
            <Check className="mr-1 h-3 w-3" /> Answered
          </Button>
        )}
      </div>
    </div>
  );
}

export default TeacherBoard;
