import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { getRoom, getParticipants, subscribe, type Participant } from "@/lib/store";
import { Users, GraduationCap } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Participants = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "teacher" ? "Teacher" : "Student";
  const userName = searchParams.get("name") || "Anonymous";
  const room = roomId ? getRoom(roomId) : undefined;
  const [participants, setParticipants] = useState<Participant[]>([]);

  const refresh = useCallback(() => {
    if (roomId) setParticipants([...getParticipants(roomId)]);
  }, [roomId]);

  useEffect(() => {
    refresh();
    if (roomId) return subscribe(roomId, refresh);
  }, [roomId, refresh]);

  useEffect(() => {
    const t = setInterval(refresh, 3000);
    return () => clearInterval(t);
  }, [refresh]);

  if (!room) return <Navigate to="/join" replace />;

  const teachers = participants.filter(p => p.role === "Teacher");
  const students = participants.filter(p => p.role === "Student");

  return (
    <DashboardLayout roomId={room.id} subject={room.subject} role={role} userName={userName}>
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="font-chalk text-2xl text-foreground">Participants</h2>
          <span className="text-xs text-muted-foreground ml-1">({participants.length} total)</span>
        </div>

        {teachers.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Teacher</p>
            {teachers.map(p => (
              <ParticipantRow key={p.name} participant={p} />
            ))}
          </div>
        )}

        {students.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Students ({students.length})</p>
            {students.map(p => (
              <ParticipantRow key={p.name} participant={p} />
            ))}
          </div>
        )}

        {participants.length === 0 && (
          <div className="chalk-card py-16 text-center">
            <p className="text-muted-foreground font-chalk text-xl">No participants yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

function ParticipantRow({ participant }: { participant: Participant }) {
  return (
    <div className="chalk-card px-4 py-3 flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary shrink-0">
        {participant.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{participant.name}</p>
        <p className="text-xs text-muted-foreground">
          Joined {new Date(participant.joinedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full border border-dashed ${
        participant.role === "Teacher" ? "border-primary text-primary" : "border-green-500 text-green-400"
      }`}>
        {participant.role === "Teacher" ? <GraduationCap className="inline h-3 w-3 mr-1" /> : null}
        {participant.role}
      </span>
    </div>
  );
}

export default Participants;
