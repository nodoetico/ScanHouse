import { useEffect, useRef, useState } from 'react';
import type { Property, Scene, Hotspot } from '../types/property';
import type { Viewer, ViewerConfig } from '../types/pannellum';
import { createViewer } from '../lib/pannellum';
import TourControls from './TourControls';
import InfoHotspotPanel from './InfoHotspotPanel';

interface TourProps {
  property: Property;
  currentScene: Scene;
  isTransitioning: boolean;
  onNavigate: (sceneId: string) => void;
  onNextScene: () => void;
  onPrevScene: () => void;
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  showAssistant: boolean;
  setShowAssistant: (show: boolean) => void;
  showFloorPlan: boolean;
  setShowFloorPlan: (show: boolean) => void;
  showLeadForm: boolean;
  setShowLeadForm: (show: boolean) => void;
}

function createTooltip(hs: Hotspot): () => HTMLElement {
  return () => {
    const el = document.createElement('div');
    el.className = 'pnlm-tooltip';
    const isNav = hs.type === 'navigation';
    el.textContent = isNav ? `${hs.name} →` : hs.name;
    return el;
  };
}

const sharedConfig = (): ViewerConfig => ({
    type: 'equirectangular',
    showZoomCtrl: false,
    showFullscreenCtrl: false,
    showControls: false,
    showCompass: false,
    minHfov: 45,
    maxHfov: 120,
    minPitch: -75,
    maxPitch: 75,
    sceneFadeDuration: 700,
  });

function buildSceneConfig(scene: Scene, onHotspotClick: (hs: Hotspot) => void, shared: ViewerConfig): ViewerConfig {
  return {
    ...shared,
    panorama: scene.panorama,
    autoLoad: true,
    autoRotate: -0.4,
    autoRotateInactivityDelay: 10000,
    hfov: scene.rotation.hfov,
    hotSpots: scene.hotspots.map(hs => ({
      pitch: hs.pitch,
      yaw: hs.yaw,
      type: 'info',
      id: hs.id,
      cssClass: hs.type === 'navigation' ? 'pnlm-hotspot-nav' : 'pnlm-hotspot-info',
      createTooltipFunc: createTooltip(hs),
      clickHandlerFunc: () => onHotspotClick(hs),
    })),
  };
}

export default function Tour({
  property,
  currentScene,
  isTransitioning,
  onNavigate,
  onNextScene,
  onPrevScene,
  showInfo,
  setShowInfo,
  showAssistant,
  setShowAssistant,
  showFloorPlan,
  setShowFloorPlan,
  showLeadForm,
  setShowLeadForm,
}: TourProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<Viewer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [infoHotspot, setInfoHotspot] = useState<Hotspot | null>(null);
  const currentSceneIndexRef = useRef(0);
  const onNavigateRef = useRef(onNavigate);

  useEffect(() => {
    onNavigateRef.current = onNavigate;
  }, [onNavigate]);

  const handleHotspotClick = (hs: Hotspot) => {
    if (hs.type === 'navigation' && hs.targetSceneId) {
      onNavigateRef.current(hs.targetSceneId);
    } else if (hs.type === 'info') {
      setInfoHotspot(hs);
    }
  };

  useEffect(() => {
    if (!viewerRef.current || viewerInstance.current) return;

    const scenes = property.scenes;
    const shared = sharedConfig();
    const sceneConfigs: Record<string, ViewerConfig> = {};
    scenes.forEach(scene => {
      sceneConfigs[scene.id] = buildSceneConfig(scene, handleHotspotClick, shared);
    });

    viewerInstance.current = createViewer(viewerRef.current, {
      ...shared,
      firstScene: scenes[0].id,
      scenes: sceneConfigs,
    });

    const viewer = viewerInstance.current;
    const handleSceneChange = (id: string) => {
      const index = scenes.findIndex(s => s.id === id);
      if (index !== -1 && index !== currentSceneIndexRef.current) {
        currentSceneIndexRef.current = index;
      }
    };
    viewer?.on('scenechange', handleSceneChange);
    viewer?.on('load', () => setIsLoaded(true));

    return () => {
      viewer?.off('scenechange', handleSceneChange);
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      }
      setIsLoaded(false);
    };
  }, [property]);

  useEffect(() => {
    const viewer = viewerInstance.current;
    if (!viewer || !isLoaded) return;

    const currentIndex = property.scenes.findIndex(s => s.id === currentScene.id);
    currentSceneIndexRef.current = currentIndex;

    if (viewer.getScene() !== currentScene.id) {
      viewer.loadScene(currentScene.id, currentScene.rotation.yaw, currentScene.rotation.pitch, currentScene.rotation.hfov);
    } else {
      viewer.lookAt(currentScene.rotation.yaw, currentScene.rotation.pitch, currentScene.rotation.hfov, 1000);
    }
  }, [currentScene, isLoaded, property]);

  return (
    <div className="fixed inset-0" role="region" aria-label="Recorrido 360°">
      {isTransitioning && (
        <div className="scene-transition-overlay flex items-center justify-center" aria-hidden="true">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest text-white/50">Transicionando...</p>
          </div>
        </div>
      )}

      <div
        ref={viewerRef}
        className="w-full h-full"
        id="panorama-viewer"
        role="application"
        aria-label="Visor panorámico 360 grados"
        aria-hidden={!!infoHotspot}
      />

      <TourControls
        property={property}
        currentScene={currentScene}
        currentSceneIndex={property.scenes.findIndex(s => s.id === currentScene.id)}
        totalScenes={property.scenes.length}
        onNextScene={onNextScene}
        onPrevScene={onPrevScene}
        onSceneSelect={onNavigate}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        showAssistant={showAssistant}
        setShowAssistant={setShowAssistant}
        showFloorPlan={showFloorPlan}
        setShowFloorPlan={setShowFloorPlan}
        showLeadForm={showLeadForm}
        setShowLeadForm={setShowLeadForm}
      />

      {infoHotspot && (
        <InfoHotspotPanel hotspot={infoHotspot} onClose={() => setInfoHotspot(null)} />
      )}
    </div>
  );
}