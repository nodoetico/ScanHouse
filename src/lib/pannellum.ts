import type { Viewer, ViewerConfig } from '../types/pannellum';

declare global {
  interface Window {
    pannellum: {
      viewer: (container: HTMLElement | string, config?: ViewerConfig) => Viewer;
    };
  }
}

export function createViewer(container: HTMLElement | string, config?: ViewerConfig): Viewer {
  if (!window.pannellum || typeof window.pannellum.viewer !== 'function') {
    throw new Error('Pannellum no se cargó. Verificá que /vendor/pannellum.js esté incluido en index.html.');
  }
  return window.pannellum.viewer(container, config);
}

export type { Viewer, ViewerConfig, HotSpot } from '../types/pannellum';