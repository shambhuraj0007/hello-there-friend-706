import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Leaderboard } from "./pages/Leaderboard";
import { PayWaterBills } from "./pages/PayWaterBills";
import { PayHomeBills } from "./pages/PayHomeBills";
import {ReportIssueWizard} from './components/mobile/ReportIssueWizard';

const ReportIssueWizardWrapper = () => {
  const navigate = useNavigate();
  return <ReportIssueWizard onComplete={() => navigate('/')} onCancel={() => navigate('/')} />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/pay-water-bills" element={<PayWaterBills />} />
            <Route path="/pay-home-bills" element={<PayHomeBills />} />
            <Route path="/report-issue" element={<ReportIssueWizardWrapper />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
