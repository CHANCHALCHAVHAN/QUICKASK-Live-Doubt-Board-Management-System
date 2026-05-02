import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import CreateRoom from "./pages/CreateRoom";
import RoomCreated from "./pages/RoomCreated";
import JoinRoom from "./pages/JoinRoom";
import Submission from "./pages/Submission";
import Analytics from "./pages/Analytics";
import LiveDiscussion from "./pages/LiveDiscussion";
import Participants from "./pages/Participants";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<CreateRoom />} />
          <Route path="/room-created/:roomId" element={<RoomCreated />} />
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/room/:roomId/doubts" element={<Submission />} />
          <Route path="/room/:roomId/analytics" element={<Analytics />} />
          <Route path="/room/:roomId/discussion" element={<LiveDiscussion />} />
          <Route path="/room/:roomId/participants" element={<Participants />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
