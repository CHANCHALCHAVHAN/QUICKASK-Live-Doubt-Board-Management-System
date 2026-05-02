import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createRoom } from "@/lib/store";
import { BookOpen, GraduationCap } from "lucide-react";

const CreateRoom = () => {
  const [teacherName, setTeacherName] = useState("");
  const [subject, setSubject] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!teacherName.trim() || !subject.trim()) return;
    const room = createRoom(teacherName.trim(), subject.trim());
    navigate(`/room-created/${room.id}`);
  };

  return (
    <div className="min-h-screen chalkboard-bg flex items-center justify-center p-4">
      <div className="chalk-card w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-primary/30 bg-primary/10">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-chalk text-3xl text-foreground">Create a Room</h1>
          <p className="text-muted-foreground text-sm mt-1">Set up a live doubt board for your lecture</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teacherName" className="text-foreground">Teacher Name</Label>
            <Input
              id="teacherName"
              placeholder="Enter your name"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="border-dashed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-foreground">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g. Data Structures"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-dashed"
            />
          </div>
          <Button className="w-full" onClick={handleCreate} disabled={!teacherName.trim() || !subject.trim()}>
            <BookOpen className="mr-2 h-4 w-4" />
            Create Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
