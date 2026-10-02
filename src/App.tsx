import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { TopBar } from './components/Navigation/TopBar';
import { MobileBottomNav } from './components/Navigation/MobileBottomNav';
import { EmergencyBanner } from './components/Common/EmergencyBanner';
import { SimulationBar } from './components/SimulationControls/SimulationBar';
import { LandingPage } from './components/Views/LandingPage';
import { SignInView } from './components/Views/SignInView';
import { SignUpView } from './components/Views/SignUpView';
import { ForgotPasswordView } from './components/Views/ForgotPasswordView';
import { LiveSceneView } from './components/Views/LiveSceneView';
import { DetectionView } from './components/Views/DetectionView';
import { TrackingView } from './components/Views/TrackingView';
import { InspectionView } from './components/Views/InspectionView';
import { SceneUnderstandingView } from './components/Views/SceneUnderstandingView';
import { IncidentsView } from './components/Views/IncidentsView';
import { ThreeDEnvironmentView } from './components/Views/ThreeDEnvironmentView';
import { ResponseView } from './components/Views/ResponseView';
import { AnalyticsView } from './components/Views/AnalyticsView';
import { ReportsView } from './components/Views/ReportsView';
import { AdminView } from './components/Views/AdminView';
import { AuthModal } from './components/Modals/AuthModal';

const AppContent: React.FC = () => {
  const { currentView } = useSimulation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Authentication Flow Views:
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage onOpenAuth={() => setIsAuthOpen(true)} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </>
    );
  }

  if (currentView === 'signin') {
    return <SignInView />;
  }

  if (currentView === 'signup') {
    return <SignUpView />;
  }

  if (currentView === 'forgot_password') {
    return <ForgotPasswordView />;
  }

  // Authenticated Command Center:
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      <TopBar onOpenAuth={() => setIsAuthOpen(true)} />
      <EmergencyBanner />
      <SimulationBar />

      <main className="flex-1 overflow-x-hidden pb-16 md:pb-0">
        {currentView === 'live_scene' && <LiveSceneView />}
        {currentView === 'detection' && <DetectionView />}
        {currentView === 'tracking' && <TrackingView />}
        {currentView === 'inspection' && <InspectionView />}
        {currentView === 'scene_understanding' && <SceneUnderstandingView />}
        {currentView === 'incidents' && <IncidentsView />}
        {currentView === '3d_environment' && <ThreeDEnvironmentView />}
        {currentView === 'response' && <ResponseView />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'reports' && <ReportsView />}
        {currentView === 'admin' && <AdminView />}
      </main>

      <MobileBottomNav />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}
