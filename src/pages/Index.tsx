import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, GraduationCap, MessageSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen chalkboard-bg flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-primary/10">
          <GraduationCap className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-chalk text-5xl md:text-6xl text-foreground mb-3">Live Doubt Board</h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">
          A real-time classroom platform for students to ask doubts during live lectures with AI-powered relevance analysis.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 w-full max-w-lg">
        <div
          className="chalk-card p-6 text-center cursor-pointer hover:border-primary/50 transition-colors group"
          onClick={() => navigate("/create")}
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-primary/30 bg-primary/10 group-hover:border-primary/50 transition-colors">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-chalk text-2xl text-foreground mb-1">I'm a Teacher</h2>
          <p className="text-muted-foreground text-xs mb-4">Create a new lecture room</p>
          <Button className="w-full">Create Room</Button>
        </div>

        <div
          className="chalk-card p-6 text-center cursor-pointer hover:border-primary/50 transition-colors group"
          onClick={() => navigate("/join")}
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-primary/30 bg-primary/10 group-hover:border-primary/50 transition-colors">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-chalk text-2xl text-foreground mb-1">I'm a Student</h2>
          <p className="text-muted-foreground text-xs mb-4">Join an existing room</p>
          <Button variant="outline" className="w-full border-dashed">Join Room</Button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-muted-foreground text-xs">
        <MessageSquare className="h-3 w-3" />
        <span>Powered by AI-driven doubt analysis</span>
      </div>
    </div>
  );
};

export default Index;
