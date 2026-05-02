import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getRoom, joinRoom } from "@/lib/store";
import { Users } from "lucide-react";

const JoinRoom = () => {
  const [searchParams] = useSearchParams();
  const [studentName, setStudentName] = useState("");
  const [roomId, setRoomId] = useState(searchParams.get("room") || "");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    setError("");
    if (!studentName.trim() || !roomId.trim() || !token.trim()) return;
    const room = getRoom(roomId.trim());
    if (!room) {
      setError("Room not found. Please check the Room ID.");
      return;
    }
    if (room.token !== token.trim().toUpperCase()) {
      setError("Invalid token. Please check with your teacher.");
      return;
    }
    joinRoom(room.id, studentName.trim());
    navigate(`/room/${room.id}/doubts?role=student&name=${encodeURIComponent(studentName.trim())}`);
  };

  return (
    <div className="min-h-screen chalkboard-bg flex items-center justify-center p-4">
      <div className="chalk-card w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-primary/30 bg-primary/10">
            <Users className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-chalk text-3xl text-foreground">Join a Room</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter the Room ID and token shared by your teacher</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentName" className="text-foreground">Your Name</Label>
            <Input
              id="studentName"
              placeholder="Enter your name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="border-dashed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomId" className="text-foreground">Room ID</Label>
            <Input
              id="roomId"
              placeholder="e.g. ABC123"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="tracking-widest text-center font-mono border-dashed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="token" className="text-foreground">Join Token</Label>
            <Input
              id="token"
              placeholder="Enter token from teacher"
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              className="tracking-widest text-center font-mono border-dashed"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            className="w-full"
            onClick={handleJoin}
            disabled={!studentName.trim() || !roomId.trim() || !token.trim()}
          >
            <Users className="mr-2 h-4 w-4" />
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
