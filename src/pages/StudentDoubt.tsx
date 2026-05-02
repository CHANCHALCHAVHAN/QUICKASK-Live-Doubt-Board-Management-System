import { useState } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getRoom, addDoubt, updateDoubtRelevance } from "@/lib/store";
import { Send, CheckCircle, XCircle, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const StudentDoubt = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const studentName = searchParams.get("name") || "Anonymous";
  const room = roomId ? getRoom(roomId) : undefined;

  const [doubtText, setDoubtText] = useState("");
  const [submittedDoubts, setSubmittedDoubts] = useState<Array<{ id: string; text: string; relevance: string }>>([]);
  const [submitting, setSubmitting] = useState(false);

  if (!room) return <Navigate to="/join" replace />;

  const handleSubmit = async () => {
    if (!doubtText.trim() || !roomId) return;
    setSubmitting(true);
    const doubt = addDoubt(roomId, studentName, doubtText.trim());
    setSubmittedDoubts(prev => [...prev, { id: doubt.id, text: doubt.text, relevance: "Analyzing..." }]);
    setDoubtText("");

    setTimeout(() => {
      const isRelevant = analyzeRelevance(doubt.text, room.subject);
      updateDoubtRelevance(roomId, doubt.id, isRelevant);
      setSubmittedDoubts(prev =>
        prev.map(d => d.id === doubt.id ? { ...d, relevance: isRelevant } : d)
      );
      setSubmitting(false);
    }, 1500);
  };

  return (
    <DashboardLayout roomId={room.id} subject={room.subject} role="Student" userName={studentName}>
      <div className="max-w-2xl mx-auto">
        {/* Submit doubt */}
        <div className="chalk-card p-5 mb-6">
          <h2 className="font-chalk text-2xl text-foreground mb-1">Ask a Doubt</h2>
          <p className="text-muted-foreground text-xs mb-4">Type your question and submit</p>
          <Textarea
            placeholder="Type your doubt here..."
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
            rows={4}
            className="border-dashed mb-3"
          />
          <Button className="w-full" onClick={handleSubmit} disabled={!doubtText.trim() || submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Submit Doubt
          </Button>
        </div>

        {/* Submissions */}
        {submittedDoubts.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-chalk text-xl text-muted-foreground">Your Submissions</h2>
            {submittedDoubts.map(d => (
              <div key={d.id} className="chalk-card p-4 flex items-start justify-between gap-3">
                <p className="text-sm text-foreground/90 flex-1">{d.text}</p>
                {d.relevance === "Analyzing..." ? (
                  <Badge variant="secondary" className="shrink-0 border border-dashed">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Analyzing
                  </Badge>
                ) : d.relevance === "Relevant" ? (
                  <Badge className="shrink-0 bg-success/20 text-success border border-dashed border-success/40 hover:bg-success/20">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Relevant
                  </Badge>
                ) : (
                  <Badge className="shrink-0 bg-destructive/20 text-destructive border border-dashed border-destructive/40 hover:bg-destructive/20">
                    <XCircle className="mr-1 h-3 w-3" />
                    Irrelevant
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

function analyzeRelevance(doubt: string, subject: string): "Relevant" | "Irrelevant" {
  const subjectWords = subject.toLowerCase().split(/\s+/);
  const doubtLower = doubt.toLowerCase();
  const hasSubjectKeyword = subjectWords.some(w => w.length > 2 && doubtLower.includes(w));
  const isQuestion = doubt.includes("?") || doubtLower.startsWith("how") || doubtLower.startsWith("what") ||
    doubtLower.startsWith("why") || doubtLower.startsWith("when") || doubtLower.startsWith("explain") ||
    doubtLower.startsWith("can") || doubtLower.startsWith("is") || doubt.length > 20;
  return hasSubjectKeyword || isQuestion ? "Relevant" : "Irrelevant";
}

export default StudentDoubt;
