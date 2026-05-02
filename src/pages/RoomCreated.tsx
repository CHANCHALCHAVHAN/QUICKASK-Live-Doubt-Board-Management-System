import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getRoom } from "@/lib/store";
import { Copy, Check, ArrowRight, GraduationCap } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const RoomCreated = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const room = roomId ? getRoom(roomId) : undefined;
  const [copied, setCopied] = useState(false);

  if (!room) return <Navigate to="/create" replace />;

  const joinUrl = `${window.location.origin}/join?room=${room.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen chalkboard-bg flex items-center justify-center p-4">
      <div className="chalk-card w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-primary/30 bg-primary/10">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-chalk text-3xl text-foreground">Room Created!</h1>
          <p className="text-muted-foreground text-sm mt-1">Share the details below with your students</p>
        </div>

        <div className="space-y-5 text-center">
          <div className="chalk-card p-4 bg-secondary/50 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Room ID</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-chalk font-bold tracking-widest text-primary">{room.id}</span>
                <Button variant="ghost" size="icon" onClick={handleCopy} className="text-muted-foreground hover:text-foreground">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Join Token</p>
              <span className="text-2xl font-chalk font-bold tracking-widest text-yellow-400">{room.token}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-foreground rounded-lg">
              <QRCodeSVG value={joinUrl} size={140} bgColor="#F9FAFB" fgColor="#0B0F19" />
            </div>
            <p className="text-xs text-muted-foreground">Scan to join this room</p>
          </div>

          <Button className="w-full" onClick={() => navigate(`/room/${room.id}/doubts?role=teacher&name=${encodeURIComponent(room.teacherName)}`)}>
            Continue to Room
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomCreated;
