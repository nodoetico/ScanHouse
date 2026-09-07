import { useState, useCallback } from 'react';
import { property } from './config/property';
import Landing from './components/Landing';
import Tour from './components/Tour';
import PropertyInfo from './components/PropertyInfo';
import Assistant from './components/Assistant';
import LeadForm from './components/LeadForm';
import FinalCTA from './components/FinalCTA';
import FloorPlan from './components/FloorPlan';
import NavigationIndicator from './components/NavigationIndicator';

type View = 'landing' | 'tour' | 'final';

function App() {
  const [view, setView] = useState<View>('landing');
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
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
    setView('tour');
  }, []);

  const handleLeadSubmit = useCallback(() => {
    setShowLeadForm(false);
    setTimeout(() => setView('final'), 500);
  }, []);

  const handleRestartTour = useCallback(() => {
    setView('tour');
    setCurrentSceneIndex(0);
  }, []);

  const handleRequestVisit = useCallback(() => {
    setView('tour');
    setShowLeadForm(true);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        className={`fixed inset-0 transition-opacity duration-1000 ${
          view === 'landing' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Landing onEnter={handleEnterProperty} branding={property.branding} />
      </div>

      <div
        className={`fixed inset-0 transition-all duration-1000 ${
          view === 'tour' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {view === 'tour' && (
        <>
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
          showLeadForm={showLeadForm}
          setShowLeadForm={setShowLeadForm}
        />
        <NavigationIndicator
          currentScene={currentScene}
          currentIndex={currentSceneIndex}
        />
        {showInfo && (
          <PropertyInfo
            property={property}
            currentScene={currentScene}
            onClose={() => setShowInfo(false)}
          />
        )}
        {showAssistant && (
          <Assistant
            knowledge={property.assistantKnowledge}
            onClose={() => setShowAssistant(false)}
          />
        )}
        {showFloorPlan && (
          <FloorPlan
            floorPlan={property.floorPlan}
            currentSceneId={currentScene.id}
            onNavigate={navigateToScene}
            onClose={() => setShowFloorPlan(false)}
          />
        )}
        {showLeadForm && (
          <LeadForm
            property={property}
            onSubmit={handleLeadSubmit}
            onClose={() => setShowLeadForm(false)}
          />
        )}
        </>
        )}
      </div>

      <div
        className={`fixed inset-0 transition-opacity duration-1000 z-50 ${
          view === 'final' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <FinalCTA
          property={property}
          onRestart={handleRestartTour}
          onRequestVisit={handleRequestVisit}
        />
      </div>
    </div>
  );
}

export default App;