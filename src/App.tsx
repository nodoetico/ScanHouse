import { useState, useCallback, useEffect, useMemo } from 'react';
import { SessionProvider, useSession } from './context/SessionContext';
import { getListing, listingsForAgency } from './data/listings';
import { buildExperience } from './data/buildExperience';
import { panelTokens } from './admin/theme';
import { pushLiveEvent } from './data/liveActivity';
import type { ListingProperty } from './types/listing';
import PublicCatalog from './public/PublicCatalog';
import PublicProperty from './public/PublicProperty';
import CompareBar from './public/CompareBar';
import CompareView from './public/CompareView';
import Tour from './components/Tour';
import PropertyInfo from './components/PropertyInfo';
import Assistant from './components/Assistant';
import FinalCTA from './components/FinalCTA';
import FloorPlan from './components/FloorPlan';
import NavigationIndicator from './components/NavigationIndicator';
import Login from './admin/Login';
import Panel from './admin/Panel';

type View =
  | 'login'
  | 'panel'
  | 'catalog'
  | 'property'
  | 'tour'
  | 'compare'
  | 'final';

function AppShell() {
  const { agency } = useSession();
  const [view, setView] = useState<View>('login');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [fromPanel, setFromPanel] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const agencyListings = useMemo(() => (agency ? listingsForAgency(agency.id) : []), [agency]);
  const listing = selectedListingId ? getListing(selectedListingId) : undefined;
  const experience = useMemo(() => (listing ? buildExperience(listing) : null), [listing]);
  const compareListings = compareIds
    .map(id => getListing(id))
    .filter((l): l is ListingProperty => Boolean(l));

  useEffect(() => {
    setCurrentSceneIndex(0);
    setShowInfo(false);
    setShowAssistant(false);
    setShowFloorPlan(false);
  }, [selectedListingId]);

  const currentScene = experience?.scenes[currentSceneIndex] ?? null;

  const navigateToScene = useCallback(
    (sceneId: string) => {
      if (!experience) return;
      const index = experience.scenes.findIndex(s => s.id === sceneId);
      if (index !== -1 && index !== currentSceneIndex) {
        setIsTransitioning(true);
        setCurrentSceneIndex(index);
        setTimeout(() => setIsTransitioning(false), 800);
      }
    },
    [experience, currentSceneIndex],
  );

  const goToNextScene = useCallback(() => {
    if (experience && currentSceneIndex < experience.scenes.length - 1) {
      setIsTransitioning(true);
      setCurrentSceneIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  }, [experience, currentSceneIndex]);

  const goToPrevScene = useCallback(() => {
    if (experience && currentSceneIndex > 0) {
      setIsTransitioning(true);
      setCurrentSceneIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  }, [experience, currentSceneIndex]);

  useEffect(() => {
    if (!agency) setView('login');
  }, [agency]);

  const handleOpenClientDemo = useCallback(() => {
    setFromPanel(true);
    setCompareIds([]);
    setSelectedListingId(null);
    setView('catalog');
  }, []);

  const handleBackToPanel = useCallback(() => {
    setView('panel');
  }, []);

  const handleSelectListing = useCallback(
    (id: string) => {
      const l = getListing(id);
      if (l) pushLiveEvent(l.agencyId, l.name, 'vista-propiedad');
      setSelectedListingId(id);
      setFromPanel(false);
      setView('property');
    },
    [],
  );

  const toggleCompare = useCallback(
    (id: string) => {
      setCompareIds(prev => {
        if (prev.includes(id)) return prev.filter(x => x !== id);
        if (prev.length >= 3) return prev;
        const l = getListing(id);
        if (l) pushLiveEvent(l.agencyId, l.name, 'comparacion');
        return [...prev, id];
      });
    },
    [],
  );

  const removeCompare = useCallback((id: string) => {
    setCompareIds(prev => prev.filter(x => x !== id));
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  const handleOpen360 = useCallback(() => {
    if (listing) pushLiveEvent(listing.agencyId, listing.name, 'tour-360');
    setShowInfo(false);
    setShowAssistant(false);
    setShowFloorPlan(false);
    setFromPanel(false);
    setView('tour');
  }, [listing]);

  const handleOpenFloorPlan = useCallback(() => {
    if (listing) pushLiveEvent(listing.agencyId, listing.name, 'plano');
    setShowInfo(false);
    setShowAssistant(false);
    setShowFloorPlan(true);
    setFromPanel(false);
    setView('tour');
  }, [listing]);

  const handleOpenAssistant = useCallback(() => {
    if (listing) pushLiveEvent(listing.agencyId, listing.name, 'ia');
    setShowInfo(false);
    setShowAssistant(true);
    setShowFloorPlan(false);
    setFromPanel(false);
    setView('tour');
  }, [listing]);

  const handleRequestVisit = useCallback(() => {
    if (listing) pushLiveEvent(listing.agencyId, listing.name, 'visita');
    setView('final');
  }, [listing]);

  const handleRestartTour = useCallback(() => {
    setCurrentSceneIndex(0);
    setShowInfo(false);
    setShowAssistant(false);
    setShowFloorPlan(false);
    setView('tour');
  }, []);

  const handleOpenExperience = useCallback((propertyId: string) => {
    const l = getListing(propertyId);
    setSelectedListingId(propertyId);
    setCurrentSceneIndex(0);
    setShowInfo(false);
    setShowAssistant(false);
    setShowFloorPlan(false);
    setFromPanel(true);
    setView('tour');
    if (l) pushLiveEvent(l.agencyId, l.name, 'tour-360');
  }, []);

  const handleBackFromCompare = useCallback(() => {
    setView(selectedListingId && listing ? 'property' : 'catalog');
  }, [selectedListingId, listing]);

  const openCompare = useCallback(() => setView('compare'), []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {view === 'login' && !agency && <Login onLogin={() => setView('panel')} />}

      {view === 'panel' && !agency && <Login onLogin={() => setView('panel')} />}

      {view === 'panel' && agency && (
        <Panel onOpenExperience={handleOpenExperience} onOpenClientDemo={handleOpenClientDemo} />
      )}

      {view === 'catalog' && agency && (
        <div className="absolute inset-0 overflow-y-auto" style={panelTokens(agency.branding)}>
          <PublicCatalog
            agency={agency}
            listings={agencyListings}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            onSelect={handleSelectListing}
            onBackToPanel={handleBackToPanel}
          />
          <CompareBar items={compareListings} onRemove={removeCompare} onClear={clearCompare} onOpenCompare={openCompare} />
        </div>
      )}

      {view === 'property' && listing && agency && (
        <div className="absolute inset-0 overflow-y-auto" style={panelTokens(agency.branding)}>
          <PublicProperty
            agency={agency}
            listing={listing}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            onOpen360={handleOpen360}
            onOpenFloorPlan={handleOpenFloorPlan}
            onOpenAssistant={handleOpenAssistant}
            onRequestVisit={handleRequestVisit}
            onSelect={handleSelectListing}
            onBackToList={() => setView('catalog')}
            onBackToPanel={handleBackToPanel}
          />
          <CompareBar items={compareListings} onRemove={removeCompare} onClear={clearCompare} onOpenCompare={openCompare} elevatedOnMobile />
        </div>
      )}

      {view === 'compare' && agency && compareListings.length >= 2 && (
        <div className="absolute inset-0 overflow-y-auto" style={panelTokens(agency.branding)}>
          <CompareView items={compareListings} onSelect={handleSelectListing} onBack={handleBackFromCompare} />
        </div>
      )}

      {(view === 'tour' || view === 'final') && agency && experience && currentScene && (
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${view === 'tour' || view === 'final' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          {view === 'tour' && (
            <>
              <Tour
                property={experience}
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
                onRequestVisit={handleRequestVisit}
                fromPanel={fromPanel}
                onBackToPanel={handleBackToPanel}
                onBackToList={() => setView('property')}
              />
              <NavigationIndicator currentScene={currentScene} currentIndex={currentSceneIndex} />
              {showInfo && (
                <PropertyInfo property={experience} currentScene={currentScene} onClose={() => setShowInfo(false)} />
              )}
              {showAssistant && (
                <Assistant knowledge={experience.assistantKnowledge} onClose={() => setShowAssistant(false)} />
              )}
              {showFloorPlan && (
                <FloorPlan
                  floorPlan={experience.floorPlan}
                  currentSceneId={currentScene.id}
                  onNavigate={navigateToScene}
                  onClose={() => setShowFloorPlan(false)}
                />
              )}
            </>
          )}

          {view === 'final' && <FinalCTA property={experience} onRestart={handleRestartTour} />}
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