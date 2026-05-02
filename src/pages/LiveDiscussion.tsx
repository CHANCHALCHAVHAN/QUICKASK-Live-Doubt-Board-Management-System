import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRoom, getDoubts, addDiscussionReply, subscribe, type Doubt } from "@/lib/store";
import { MessageSquare, Send } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const LiveDiscussion = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "teacher" ? "Teacher" : "Student";
  const userName = searchParams.get("name") || "Anonymous";
  const room = roomId ? getRoom(roomId) : undefined;
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [replies, setReplies] = useState<Record<string, string>>({});

  const refresh = useCallback(() => {
    if (roomId) setDoubts([...getDoubts(roomId)].filter(d => d.answered));
  }, [roomId]);

  useEffect(() => {
    refresh();
    if (roomId) return subscribe(roomId, refresh);
  }, [roomId, refresh]);

  useEffect(() => {
    const t = setInterval(refresh, 2000);
    return () => clearInterval(t);
  }, [refresh]);

  if (!room) return <Navigate to="/join" replace />;

  const handleReply = (doubtId: string) => {
    const text = replies[doubtId]?.trim();
    if (!text || !roomId) return;
    addDiscussionReply(roomId, doubtId, `${userName}: ${text}`);
    setReplies(prev => ({ ...prev, [doubtId]: "" }));
  };

  return (
    <DashboardLayout roomId={room.id} subject={room.subject} role={role} userName={userName}>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="font-chalk text-2xl text-foreground">Live Discussion</h2>
          <span className="text-xs text-muted-foreground">(answered doubts only)</span>
        </div>

        {doubts.length === 0 && (
          <div className="chalk-card py-16 text-center">
            <p className="text-muted-foreground font-chalk text-xl">No answered doubts yet.</p>
            <p className="text-xs mt-2 text-muted-foreground">Answered doubts will appear here for discussion.</p>
          </div>
        )}

        {doubts.map(d => (
          <div key={d.id} className="chalk-card p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{d.studentName}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(d.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-sm text-foreground/90">{d.text}</p>
            </div>

            {/* Discussion thread */}
            {d.discussion.length > 0 && (
              <div className="border-l-2 border-dashed border-primary/30 pl-3 space-y-1">
                {d.discussion.map((reply, i) => (
                  <p key={i} className="text-xs text-muted-foreground">{reply}</p>
                ))}
              </div>
            )}

            {/* Reply input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a reply..."
                value={replies[d.id] || ""}
                onChange={e => setReplies(prev => ({ ...prev, [d.id]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleReply(d.id)}
                className="border-dashed text-sm h-8"
              />
              <Button size="sm" variant="outline" className="border-dashed h-8 px-2" onClick={() => handleReply(d.id)}>
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default LiveDiscussion;
