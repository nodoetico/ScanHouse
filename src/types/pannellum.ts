export interface HotSpot {
  pitch: number;
  yaw: number;
  type?: string;
  text?: string;
  URL?: string;
  targetPitch?: number;
  targetYaw?: number;
  targetHfov?: number;
  sceneId?: string;
  id?: string;
  clickHandlerFunc?: (event: MouseEvent | TouchEvent) => void;
  createTooltipFunc?: (element: HTMLElement, args?: any) => void;
  createTooltipArgs?: any;
  div?: HTMLDivElement;
  cssClass?: string;
  createInfoboxFunc?: () => HTMLElement;
}

export interface ViewerConfig {
  panorama?: string;
  type?: 'equirectangular' | 'cubemap' | 'multires' | string;
  autoLoad?: boolean;
  autoRotate?: number;
  autoRotateInactivityDelay?: number;
  showZoomCtrl?: boolean;
  showFullscreenCtrl?: boolean;
  showControls?: boolean;
  showCompass?: boolean;
  sceneFadeDuration?: number;
  hfov?: number;
  minHfov?: number;
  maxHfov?: number;
  pitch?: number;
  yaw?: number;
  minPitch?: number;
  maxPitch?: number;
  hotSpots?: HotSpot[];
  title?: string;
  author?: string;
  authorURL?: string;
  scenes?: Record<string, ViewerConfig>;
  default?: ViewerConfig;
  firstScene?: string;
  onLoad?: () => void;
  onError?: (e: string) => void;
}

export interface Viewer {
  destroy(): void;
  setHfov(hfov: number, duration?: number): void;
  setPitch(pitch: number, duration?: number): void;
  setYaw(yaw: number, duration?: number): void;
  lookAt(pitch: number, yaw: number, hfov?: number, duration?: number): void;
  addHotSpot(hs: HotSpot, sceneId?: string): void;
  removeHotSpot(hotSpotId: string, sceneId?: string): void;
  getConfig(): any;
  getScene(): string | null;
  getHFov(): number;
  getPitch(): number;
  getYaw(): number;
  loadScene(sceneId: string, yaw?: number, pitch?: number, hfov?: number): void;
  mouseEventToCoords(event: { clientX: number; clientY: number }): { x: number; y: number } | null;
  pitchYawToCanvasCoords(pitch: number, yaw: number): { x: number; y: number } | null;
  on(event: string, listener: (data?: any) => void): void;
  off(event: string, listener: (data?: any) => void): void;
  trigger(event: string, data?: any): void;
  addScene(sceneId: string, config: ViewerConfig): void;
  isLoaded(): boolean;
}