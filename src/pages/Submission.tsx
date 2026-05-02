import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getRoom, addDoubt, updateDoubtRelevance, getDoubts, markAsAnswered, subscribe, type Doubt } from "@/lib/store";
import { Send, CheckCircle, XCircle, Loader2, Check } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

function analyzeRelevance(doubt: string, subject: string): "Relevant" | "Irrelevant" {
  const subjectWords = subject.toLowerCase().split(/\s+/);
  const doubtLower = doubt.toLowerCase();
  const hasKeyword = subjectWords.some(w => w.length > 2 && doubtLower.includes(w));
  const isQuestion = doubt.includes("?") || /^(how|what|why|when|explain|can|is)\b/i.test(doubt) || doubt.length > 20;
  return hasKeyword || isQuestion ? "Relevant" : "Irrelevant";
}

const Submission = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "teacher" ? "Teacher" : "Student";
  const userName = searchParams.get("name") || "Anonymous";
  const room = roomId ? getRoom(roomId) : undefined;

  const [doubtText, setDoubtText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [allDoubts, setAllDoubts] = useState<Doubt[]>([]);

  const refresh = useCallback(() => {
    if (roomId) setAllDoubts([...getDoubts(roomId)]);
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

  const handleSubmit = () => {
    if (!doubtText.trim() || !roomId) return;
    setSubmitting(true);
    const doubt = addDoubt(roomId, userName, doubtText.trim());
    setDoubtText("");
    setTimeout(() => {
      updateDoubtRelevance(roomId, doubt.id, analyzeRelevance(doubt.text, room.subject));
      setSubmitting(false);
    }, 1500);
  };

  const unanswered = allDoubts.filter(d => !d.answered);
  const answered = allDoubts.filter(d => d.answered);

  return (
    <DashboardLayout roomId={room.id} subject={room.subject} role={role} userName={userName}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Submit panel — students and teachers can both submit */}
        <div className="chalk-card p-5">
          <h2 className="font-chalk text-2xl text-foreground mb-1">Submit a Doubt</h2>
          <p className="text-muted-foreground text-xs mb-4">Type your question and submit</p>
          <Textarea
            placeholder="Type your doubt here..."
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
            rows={3}
            className="border-dashed mb-3"
          />
          <Button className="w-full" onClick={handleSubmit} disabled={!doubtText.trim() || submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Submit Doubt
          </Button>
        </div>

        {/* Pending doubts */}
        {unanswered.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-chalk text-xl text-muted-foreground">Pending ({unanswered.length})</h2>
            {unanswered.map(d => (
              <DoubtCard key={d.id} doubt={d} roomId={room.id} isTeacher={role === "Teacher"} onRefresh={refresh} />
            ))}
          </div>
        )}

        {/* Answered doubts */}
        {answered.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-chalk text-xl text-muted-foreground">Answered ({answered.length})</h2>
            {answered.map(d => (
              <DoubtCard key={d.id} doubt={d} roomId={room.id} isTeacher={role === "Teacher"} onRefresh={refresh} />
            ))}
          </div>
        )}

        {allDoubts.length === 0 && (
          <div className="chalk-card py-16 text-center">
            <p className="text-muted-foreground font-chalk text-xl">No doubts submitted yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

function DoubtCard({ doubt, roomId, isTeacher, onRefresh }: { doubt: Doubt; roomId: string; isTeacher: boolean; onRefresh: () => void }) {
  const handleMarkAnswered = () => {
    markAsAnswered(roomId, doubt.id);
    onRefresh();
  };

  return (
    <div className={`chalk-card p-4 transition-opacity ${doubt.answered ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-sm font-medium text-foreground">{doubt.studentName}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(doubt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            {doubt.relevance === "Relevant" ? (
              <Badge className="text-xs bg-green-500/20 text-green-400 border border-dashed border-green-500/40 hover:bg-green-500/20">
                <CheckCircle className="mr-1 h-3 w-3" /> Relevant
              </Badge>
            ) : doubt.relevance === "Irrelevant" ? (
              <Badge className="text-xs bg-destructive/20 text-destructive border border-dashed border-destructive/40 hover:bg-destructive/20">
                <XCircle className="mr-1 h-3 w-3" /> Irrelevant
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs border border-dashed">
                <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Analyzing
              </Badge>
            )}
          </div>
          <p className="text-sm text-foreground/90">{doubt.text}</p>
        </div>
        {isTeacher && !doubt.answered && (
          <Button variant="outline" size="sm" onClick={handleMarkAnswered} className="shrink-0 border-dashed">
            <Check className="mr-1 h-3 w-3" /> Answered
          </Button>
        )}
      </div>
    </div>
  );
}

export default Submission;
