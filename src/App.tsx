import { useState, useCallback } from 'react';
import { SessionProvider, useSession } from './context/SessionContext';
import { property } from './config/property';
import Landing from './components/Landing';
import Tour from './components/Tour';
import PropertyInfo from './components/PropertyInfo';
import Assistant from './components/Assistant';
import FinalCTA from './components/FinalCTA';
import FloorPlan from './components/FloorPlan';
import NavigationIndicator from './components/NavigationIndicator';
import Login from './admin/Login';
import Panel from './admin/Panel';

type PublicView = 'landing' | 'tour' | 'final';
type View = PublicView | 'login' | 'panel';

function AppShell() {
  const { agency } = useSession();
  const [view, setView] = useState<View>('landing');
  const [fromPanel, setFromPanel] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentScene = property.scenes[currentSceneIndex];

  const navigateToScene = useCallback((sceneId: string) => {
    const index = property.scenes.findIndex(s => s.id === sceneId);
    if (index !== -1 && index !== currentSceneIndex) {
      setIsTransitioning(true);
      setCurrentSceneIndex(index);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  }, [currentSceneIndex]);

  const goToNextScene = useCallback(() => {
    if (currentSceneIndex < property.scenes.length - 1) {
      setIsTransitioning(true);
      setCurrentSceneIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  }, [currentSceneIndex]);

  const goToPrevScene = useCallback(() => {
    if (currentSceneIndex > 0) {
      setIsTransitioning(true);
      setCurrentSceneIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  }, [currentSceneIndex]);

  const handleEnterProperty = useCallback(() => {
    setFromPanel(false);
    setView('tour');
  }, []);

  const handleGoToFinal = useCallback(() => {
    setView('final');
  }, []);

  const handleRestartTour = useCallback(() => {
    setView('tour');
    setCurrentSceneIndex(0);
  }, []);

  const handleOpenLogin = useCallback(() => {
    setFromPanel(false);
    setView('login');
  }, []);

  const handleOpenExperience = useCallback((_propertyId: string) => {
    setFromPanel(true);
    setCurrentSceneIndex(0);
    setView('tour');
  }, []);

  const handleBackToPanel = useCallback(() => {
    setView('panel');
  }, []);

  const isPublic = view === 'landing' || view === 'tour' || view === 'final';

  return (
    <div className="fixed inset-0 overflow-hidden">
      {view === 'login' && <Login onLogin={() => setView('panel')} />}

      {view === 'panel' && agency && <Panel onOpenExperience={handleOpenExperience} />}

      {view === 'panel' && !agency && <Login onLogin={() => setView('panel')} />}

      {(isPublic || (view === 'panel' && !agency)) && (
        <div
          className={`fixed inset-0 transition-opacity duration-500 ${
            isPublic ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {view === 'landing' && <Landing onEnter={handleEnterProperty} branding={property.branding} onAdmin={handleOpenLogin} />}

          {view === 'tour' && (
            <>
              <div
                className={`fixed inset-0 transition-all duration-1000 ${
                  view === 'tour' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                <Tour
                  property={property}
                  currentScene={currentScene}
                  isTransitioning={isTransitioning}
                  onNavigate={navigateToScene}
                  onNextScene={goToNextScene}
                  onPrevScene={goToPrevScene}
                  showInfo={showInfo}
                  setShowInfo={setShowInfo}
                  showAssistant={showAssistant}
                  setShowAssistant={setShowAssistant}
                  showFloorPlan={showFloorPlan}
                  setShowFloorPlan={setShowFloorPlan}
                  onRequestVisit={handleGoToFinal}
                />
                <NavigationIndicator currentScene={currentScene} currentIndex={currentSceneIndex} />
                {showInfo && (
                  <PropertyInfo property={property} currentScene={currentScene} onClose={() => setShowInfo(false)} />
                )}
                {showAssistant && (
                  <Assistant knowledge={property.assistantKnowledge} onClose={() => setShowAssistant(false)} />
                )}
                {showFloorPlan && (
                  <FloorPlan
                    floorPlan={property.floorPlan}
                    currentSceneId={currentScene.id}
                    onNavigate={navigateToScene}
                    onClose={() => setShowFloorPlan(false)}
                  />
                )}
              </div>

              {fromPanel && (
                <button
                  onClick={handleBackToPanel}
                  className="absolute top-3 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-black/60 border border-white/20 font-mono text-[11px] uppercase tracking-widest text-white/80 hover:bg-black hover:text-white transition-colors cursor-pointer pointer-events-auto"
                >
                  ← Volver al panel
                </button>
              )}
            </>
          )}

          {view === 'final' && (
            <FinalCTA property={property} onRestart={handleRestartTour} />
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <SessionProvider>
      <AppShell />
    </SessionProvider>
  );
}

export default App;